# Clinoro production deployment

Updated: 2026-08-13

## Source of truth

- Repository: `MRGT2025/clinoro-website`
- Production branch: `main`
- Pre-Phase-2 restore point: `restore/clinoro-pre-phase-2-20260813-b21e523`
- Production URL: `https://clinoromedical.com`
- Production Worker: `clinoro-website`
- Worker URL: `https://clinoro-website.reisi-general-trading.workers.dev`

The live application and repository both target the same Worker name. Do not
change the standalone Cloudflare `name` in `vite.config.ts` without updating
and verifying the production Worker and custom-domain route together.

## Release path

1. Merge or commit the validated source to `main`.
2. Cloudflare Workers Builds detects the new `main` commit.
3. Cloudflare installs the locked dependencies and runs:

   ```sh
   npm run build:cloudflare
   ```

4. The build emits `dist/server/wrangler.json` with `name: clinoro-website`.
5. Cloudflare deploys the artifact to the `clinoro-website` Worker.
6. The existing custom-domain route serves it at `clinoromedical.com`.

There is no GitHub Actions workflow in this repository. The production build is
owned by Cloudflare's Git integration, so a missing GitHub Check does not prove
that deployment failed. Verify the live domain after every release.

## Required Cloudflare build variables

Store these values only in Cloudflare; never commit their values.

- `CLINORO_D1_DATABASE_ID`
- `CLINORO_R2_BUCKET_NAME`

The production bindings must remain:

- D1 binding `DB`, database name `clinoro-production`
- R2 binding `BUCKET`

## Manual deployment

An authenticated operator may build and deploy the same target manually:

```sh
npm ci
npm run build:cloudflare
npm run deploy:cloudflare
```

Before a manual deploy, verify that the two required build variables point to
the existing production D1 database and R2 bucket. Never deploy an artifact
built with placeholder resource identifiers.

## Release verification

Test these URLs after every release:

- `https://clinoromedical.com/`
- `https://clinoromedical.com/blog`
- `https://clinoromedical.com/sitemap.xml`
- at least one current article URL
- `https://clinoromedical.com/admin` as an unauthenticated request
- `https://clinoro-website.reisi-general-trading.workers.dev/`

Required checks:

- Home, Blog, sitemap and the test article return HTTP 200.
- Home and Blog expose the same newest published articles.
- Every published article in Blog is present once in the sitemap.
- Article canonical, Open Graph `published_time`, and JSON-LD `datePublished`
  use the same full ISO timestamp.
- `/admin` redirects an unauthenticated request to Cloudflare Access.
- The Worker URL and custom domain serve the same release marker/content.

The current global design-studio release marker is:

```html
<meta name="clinoro-deployment" content="clinoro-95-20260814">
```

It is harmless and provides an exact end-to-end signal from the GitHub commit
through Cloudflare to the custom domain.

## Rollback

For a source rollback, create a new commit that restores the known-good source
from the restore branch and let the normal `main` pipeline deploy it. For an
urgent runtime rollback, use Cloudflare Worker version rollback, then align
`main` with the restored version so the next build does not reintroduce the
fault.

Daily article automation must remain disabled until all release verification
checks above pass in production.
