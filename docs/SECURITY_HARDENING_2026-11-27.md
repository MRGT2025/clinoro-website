# Clinoro administrator security hardening

## Production build and identity boundary

Production continues to use `npm run build:cloudflare` and
`npm run deploy:cloudflare` through the existing Cloudflare build for `main`.
The standalone configuration contains the non-secret Access issuer and audience,
and keeps `workers_dev` and `preview_urls` disabled. D1 and R2 remain the existing
`DB` and `BUCKET` bindings. No database-schema change is required.

The Worker verifies the Access assertion's RS256 signature, pinned issuer,
application audience, expiration, activation time and user email before allowing
an administrator request to reach the app. The verified identity is scoped to the
individual request. App code no longer treats raw email headers as authentication.
Existing owner and active-member authorization checks remain in force.

The generic development/build scripts explicitly select the Sites target when
no target is supplied. Only the exact `CLINORO_TARGET=sites` build trusts the
documented Sites dispatch identity boundary. Missing or unknown target values
do not enable header trust in the Worker. A Sites artifact must not be deployed
as the public standalone production Worker. A supplied `CLINORO_TARGET=cloudflare`
is preserved by the generic scripts.

Cloudflare Access should continue to protect `/admin` and `/api/admin` at the
canonical domain. The application verification remains necessary even when an
Access policy is already in front of those routes. Access policy audience or
team-domain changes require updating the matching non-secret build configuration.

## Request and output protections

- Administrator mutation handlers enforce same-origin requests, correct content
  types and actual streamed-body limits before parsing. The content editor allows
  up to 8 MiB of JSON; small administration requests allow 32 KiB.
- Uploads retain the previous per-format limits, with an additional streamed
  overall multipart cap before parsing and byte-signature checks for accepted
  formats. Signature checks are not a malware scanner. Media remains public
  marketing content, as before.
- Public RFQ submissions require same-origin JSON and an actual 20,000-byte limit.
  Existing phone/email throttling remains a secondary control and now reports
  `429` with `Retry-After`. Edge IP rate limiting is managed separately.
- Every JSON-LD output uses the same HTML-safe serializer. It preserves JSON
  values while preventing content from closing a script element. Intentional
  owner-managed `InjectionLayer` behavior is unchanged.
- Unexpected internal errors use a generic client response. Explicit validation
  errors retain their status and user-facing message.

Programmatic clients calling the browser administration APIs must supply the
approved site Origin and correct Content-Type in addition to valid authentication.
There is no blanket exception for requests missing Origin.

## Dependency security update

The lockfile includes compatible security updates, with exact direct versions:

| Package group | Version |
| --- | --- |
| Next.js and its ESLint configuration | 16.4.6 |
| React, React DOM and React Server DOM Webpack | 19.2.9 |
| Vite | 8.1.6 |
| Vite RSC plugin | 0.5.39 |
| Cloudflare Vite plugin / Wrangler | 1.70.2 / 4.168.0 |

Vinext remains at 0.0.50. Its pinned `image-size` dependency has a scoped override
to the patched 2.0.3 release. Compatible transitive updates include PostCSS,
Sharp, Nano ID, source-map-js and baseline-browser-mapping. The package lock
records every resolved version and integrity value. No forced audit fix or
direct dependency major-version upgrade was used.

The production-only audit on 2026-11-27 has zero findings. The full audit,
including development dependencies, has seven moderate affected package nodes
arising from two remaining dependency chains:

- Drizzle Kit's legacy `@esbuild-kit/esm-loader` uses esbuild 0.18.20. Its
  advisory concerns the esbuild development server. This project uses that
  chain for local configuration transforms and does not start its development
  server. The parent dependency does not offer a compatible patched resolution.
- Vinext's `@vercel/og` 0.8.6 embeds Satori 0.16.0 in its published bundle.
  Clinoro does not import `next/og` or generate OG images, and this code is not
  present in the production Worker. Overriding the separate Satori dependency
  would leave the embedded vulnerable copy intact. Introducing OG generation
  requires upgrading this integration and verifying the bundled Satori version.

These residual chains require a separate compatibility-reviewed framework/tool
migration. They are not omitted from the audit. A package advisory is not proof
of a working production exploit: the application runs Vinext on Cloudflare
Workers, rather than a Next.js server on Windows. The RSC runtime is bundled
despite being declared as a development dependency, which is why the full audit
and compiled-runtime verification are required alongside the production audit.

## Verification

`npm run build:cloudflare` is the release gate used by the existing Cloudflare
build before its deployment command. It runs these steps in order and stops on
the first failure:

1. `npm audit --include=dev --audit-level=high` audits the complete dependency
   graph. Explicit development-dependency inclusion also covers the bundled RSC
   runtime when a build environment sets `NODE_ENV=production` or omits dev
   dependencies by default. Any high or critical finding fails the gate and
   prevents the existing build pipeline from proceeding to deployment.
2. `CLINORO_TARGET=cloudflare bash scripts/build-verified.sh` builds and validates
   the standalone production artifact using the existing binding identifiers.
3. `npm run test:security` runs the 14 helper tests with locally generated RSA
   keys and synthetic requests.
4. `npm run test:security:worker` runs the six compiled standalone Worker tests
   with dummy signed identities and a memory-only database. They check positive
   access, role separation, concurrent request isolation, spoofed-header
   rejection, encoded admin routes and unsafe requests without database writes.
5. `node --test tests/rendered-html.test.mjs` runs the complete 131-test rendered
   page, RFQ, content and SEO suite against that same production artifact.

The gate permits the seven documented moderate findings under its high-severity
threshold. They remain visible in the full audit output; there is no ignore list
or advisory suppression. A new high or critical finding requires remediation
before the build succeeds. The gate does not call `npm test` or the generic Sites
build, and the tests do not rebuild or replace the production artifact.

The production-only audit can also be inspected with `npm audit --omit=dev`.
Compiled-runtime inspection must confirm that the Worker uses the installed
patched React Server DOM package.

The tests do not use production tokens, retrieve customer records, send real
enquiries, upload media or change production data. Verify canonical public pages,
anonymous Access redirects and the legitimate administrator login after rollout.
Do not describe unsigned-header tests or local dummy-token tests as a verified
production login.
