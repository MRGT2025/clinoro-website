# Daily Clinoro publication and recovery

The existing scheduled task owns publication. Do not add another automation,
change DNS, replace the production database, or deploy local dummy bindings.
Use the latest remote `main`, not a cached checkout from a previous run. Read
`PRODUCTION_DEPLOYMENT.md` for the established Cloudflare Git release path.

## Required first check

1. Read remote `main` and the current Tehran calendar date. Re-clone if the
   scratch checkout has expired; no local file is a durable dependency.
2. Run `node scripts/verify-daily-blog.mjs --date YYYY-MM-DD`.
3. Interpret the JSON status, not the automation's completed/run timestamp:
   - `needs_publication` (exit 2): no daily source exists. Produce today's post.
   - `source_invalid` (exit 3): fix today's incomplete post; do not add a second.
   - `source_ready` (`--source-only`): local source passes; this is not publication.
   - `pending_deployment` (exit 3): finish/recover the same release and verify it.
   - `verified` (exit 0): the exact daily source, article, Home, Blog, sitemap,
     image and metadata passed. Do not publish another article for that date.

The market is computed from calendar-day distance to 2026-08-14: even = Iran,
odd = global. It must not depend on whether yesterday's execution succeeded.
The first slot is 08:00 Tehran; the same task checks again at 09:00 and 10:00
to recover missed or incomplete publication. These are recovery checks, not
additional articles. No-update output is permitted only after verifying today's
already-published post. If publication is absent, report a concrete blocker;
do not silently exit or reuse yesterday's result.

## Content and validation

- Inspect all existing titles, topics, angles and slugs before selecting a topic.
- Verify current important claims with primary sources. Distinguish standards,
  law and proposed engineering acceptance criteria.
- Add one `lib/daily-blog-posts-YYYY-MM-DD.ts` entry to the shared `blogPosts`
  source in `lib/site-content.ts`. Never overwrite older posts or custom D1 data.
- Use a fresh, relevant, text-free realistic hero in `public/assets/blog/`, with
  Persian alt and provenance. Use full Tehran ISO timestamps (`+03:30`).
- Keep external reference links in `sources`; the renderer produces one final
  bibliography paragraph. No external links inside article prose; preserve CTAs.
- Run `npm run install:ci`, `npm run lint`, `npm test`, Cloudflare compatibility
  build, and `npm run validate:artifact`. A failed gate blocks publication.
- If production binding IDs are unavailable locally, use only temporary command
  environment values for compatibility testing. Do not commit or deploy them:

  ```sh
  CLINORO_D1_DATABASE_ID=11111111-1111-4111-8111-111111111111 \
  CLINORO_R2_BUCKET_NAME=clinoro-compatibility-nondeploy npm run build:cloudflare
  ```

## Atomic release and proof

Re-read remote main immediately before publishing. Use the connected GitHub
Git data API when CLI authentication is unavailable: blobs → tree based on
the current tree → commit with current parent → main update with expected SHA,
force=false. Preserve concurrent changes. Commit only the reviewed source,
tests, image and documentation; never build output, credentials or dummy IDs.

Wait for the Cloudflare Git build associated with that exact commit, then rerun
the verifier against public production. Also test actual Blog autocomplete in
the browser. A local network 403/timeout is not evidence of site failure: use
the authorized connector or browser verification and retain exact evidence.
If all live checks pass, report the article link and commit. If any required
check remains unproven, report the precise limitation and resume the same
article in the next recovery slot. Keep this recurring task enabled.
