# Clinoro production migration to Cloudflare

This runbook moves the full dynamic Clinoro website to Cloudflare Workers while
preserving the existing public design, server-rendered pages, CMS, RFQ inbox,
D1 content and R2 media.

The current OpenAI Sites deployment remains the rollback origin until the new
deployment passes public, admin, RFQ, media and Iran connectivity checks.

## Target architecture

- Cloudflare Workers serves the vinext application and local static assets.
- D1 stores the CMS document, administrator list and RFQ submissions.
- R2 stores uploaded images, video and PDF files.
- Cloudflare Access protects `/admin*` and `/api/admin*`.
- GitHub Actions validates, migrates and deploys the application.
- `clinoromedical.com` and `www.clinoromedical.com` become Worker custom
  domains only after the staging deployment is verified.

Cloudflare documentation:

- [Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/)
- [D1 overview](https://developers.cloudflare.com/d1/)
- [R2 pricing](https://developers.cloudflare.com/r2/pricing/)
- [Worker custom domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
- [Cloudflare Access application paths](https://developers.cloudflare.com/cloudflare-one/access-controls/policies/app-paths/)
- [Cloudflare Access JWT validation](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/)

## Phase 1 — create the account without changing production

1. Create a Cloudflare account controlled by the Clinoro owner.
2. Add `clinoromedical.com` as a website on the Free plan.
3. Let Cloudflare scan the current DNS zone.
4. Before changing nameservers, compare every imported record with GoDaddy.
   Preserve all Mailgun MX, SPF, DKIM and DMARC records, plus any domain
   verification records. Do not remove email records.
5. Do not enable the Worker custom domains yet.

Changing the authoritative nameservers is an account-owner action. The account
login, email verification and recovery settings must stay with the owner.

## Phase 2 — create Workers resources

From a trusted local terminal:

```bash
npx wrangler login
npx wrangler d1 create clinoro-medical --location=weur
npx wrangler r2 bucket create clinoro-media --location=weur
```

Save the returned D1 database UUID. Do not commit API tokens or generated
Wrangler configuration.

## Phase 3 — configure protected administrator access

In Cloudflare Zero Trust:

1. Create a team domain.
2. Enable One-time PIN or the owner's preferred identity provider.
3. Create one self-hosted Access application with protected public hostnames
   for:
   - `clinoromedical.com/admin*`
   - `clinoromedical.com/api/admin*`
   - `www.clinoromedical.com/admin*`
   - `www.clinoromedical.com/api/admin*`
4. Use an Allow policy containing only the approved administrator email
   addresses. Never use an `Everyone` or all-valid-emails policy.
5. Copy the Team Domain and Application Audience (AUD) tag.

The application validates every Access JWT against Cloudflare's rotating JWKS,
issuer and AUD before accepting an administrator identity. The existing Sites
login continues working before cutover.

## Phase 4 — configure GitHub

Add these repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_D1_DATABASE_ID`

Add these repository variables:

- `CLOUDFLARE_ACCESS_TEAM_DOMAIN`
- `CLOUDFLARE_ACCESS_AUD`
- `CLOUDFLARE_CUSTOM_DOMAINS`

Leave `CLOUDFLARE_CUSTOM_DOMAINS` empty for the first staging deployment. The
API token should use the minimum permissions needed for Workers Scripts, D1,
R2 and Worker routes/custom domains.

Run the `Deploy Clinoro to Cloudflare` workflow manually. It will lint, build,
test, validate the Worker package, apply D1 migrations and deploy a
`workers.dev` staging URL.

## Phase 5 — copy production data before DNS cutover

1. Sign in to the current Clinoro `/admin` panel as the owner.
2. Open **مدیران** and download **فایل پشتیبان مهاجرت**.
3. Keep `clinoromedical.com` pointed at the current Sites deployment while
   importing, because the backup contains HTTPS source URLs for R2 media.
4. Render the destination config and import:

```bash
export CLOUDFLARE_D1_DATABASE_ID="<D1 UUID>"
export CLOUDFLARE_ACCESS_TEAM_DOMAIN="https://<team>.cloudflareaccess.com"
export CLOUDFLARE_ACCESS_AUD="<application AUD>"
npm run cloudflare:config
npm run cloudflare:migrate
npm run cloudflare:import -- /path/to/clinoro-migration-YYYY-MM-DD.json --confirm-import --dry-run
npm run cloudflare:import -- /path/to/clinoro-migration-YYYY-MM-DD.json --confirm-import
```

The import uses `INSERT OR REPLACE` in the destination D1 database and uploads
every exported media object to R2. Run it against the new empty Clinoro
database, not an unrelated or populated database.

## Phase 6 — controlled DNS cutover

1. Confirm the Cloudflare zone contains all 17 current DNS records, especially
   Mailgun MX/TXT records.
2. Change the domain nameservers at GoDaddy to the pair assigned by Cloudflare.
3. Confirm the old site and email still work through the imported DNS zone.
4. Set the GitHub variable:

```text
CLOUDFLARE_CUSTOM_DOMAINS=clinoromedical.com,www.clinoromedical.com
```

5. Immediately before the deployment, remove only the old web-host records
   that conflict with Worker custom domains:
   - apex A records for the previous Sites host
   - the old `www` CNAME for the previous Sites host
6. Run the deployment workflow again. Wrangler creates the Worker custom
   domain records and TLS certificates.

Do not delete MX, SPF, DKIM, DMARC or other mail records.

## Acceptance tests

The migration is complete only when all checks pass:

- `/`, `/products`, `/services`, `/solutions`, `/procurement`, `/about`,
  `/blog` and `/contact` render on first load without a reload.
- Blog cards and post content are present in initial server HTML.
- `/admin` requires Cloudflare Access and rejects unverified requests.
- Saving CMS edits persists after logout and a new session.
- Image/PDF upload and `/api/media/:id` work.
- A new RFQ can be submitted and appears in the admin inbox.
- Apex and `www` use valid HTTPS.
- Public pages return HTTP 200 from multiple Iranian probes and from at least
  one real Iranian ISP without a VPN.
- Email delivery still passes MX, SPF, DKIM and DMARC checks.

Cloudflare reachability can vary by Iranian ISP or during national network
disruptions. Do not declare the Iran issue solved until the deployed Clinoro
domain is tested from Iran.

## Rollback

Keep the current Sites deployment available until acceptance is complete. If a
cutover check fails, restore the previous web records in Cloudflare DNS:

- apex A: `162.159.143.30`
- apex A: `172.66.3.26`
- `www` CNAME: `custom-domains.chatgpt.site`

The email records remain unchanged during both cutover and rollback.
