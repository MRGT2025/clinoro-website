import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const outputPath = resolve(
  process.env.CLOUDFLARE_WRANGLER_CONFIG ??
    ".wrangler/clinoro-production.jsonc",
);

const databaseId = required(
  "CLOUDFLARE_D1_DATABASE_ID",
  process.env.CLOUDFLARE_D1_DATABASE_ID,
);
if (
  !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    databaseId,
  )
) {
  fail("CLOUDFLARE_D1_DATABASE_ID must be a valid D1 UUID.");
}

const teamDomain = normalizedTeamDomain(
  required(
    "CLOUDFLARE_ACCESS_TEAM_DOMAIN",
    process.env.CLOUDFLARE_ACCESS_TEAM_DOMAIN,
  ),
);
const audience = required(
  "CLOUDFLARE_ACCESS_AUD",
  process.env.CLOUDFLARE_ACCESS_AUD,
);
if (!/^[A-Za-z0-9_-]{20,200}$/.test(audience)) {
  fail("CLOUDFLARE_ACCESS_AUD has an unexpected format.");
}

const workerName =
  cleanName(process.env.CLOUDFLARE_WORKER_NAME) ?? "clinoro-medical";
const databaseName =
  cleanName(process.env.CLOUDFLARE_D1_DATABASE_NAME) ?? "clinoro-medical";
const bucketName =
  cleanName(process.env.CLOUDFLARE_R2_BUCKET) ?? "clinoro-media";
const customDomains = optionalDomains(
  process.env.CLOUDFLARE_CUSTOM_DOMAINS ??
    process.env.CLOUDFLARE_CUSTOM_DOMAIN,
);

const config = {
  $schema: "../node_modules/wrangler/config-schema.json",
  name: workerName,
  main: "../dist/server/index.js",
  compatibility_date: "2026-07-26",
  compatibility_flags: ["nodejs_compat"],
  workers_dev: true,
  preview_urls: true,
  assets: {
    directory: "../dist/client",
    binding: "ASSETS",
  },
  d1_databases: [
    {
      binding: "DB",
      database_name: databaseName,
      database_id: databaseId,
      migrations_dir: "../drizzle",
    },
  ],
  r2_buckets: [
    {
      binding: "BUCKET",
      bucket_name: bucketName,
    },
  ],
  vars: {
    AUTH_PROVIDER: "cloudflare-access",
    POLICY_AUD: audience,
    TEAM_DOMAIN: teamDomain,
  },
  observability: {
    enabled: true,
  },
  ...(customDomains.length
    ? {
        routes: customDomains.map((pattern) => ({
          pattern,
          custom_domain: true,
        })),
      }
    : {}),
};

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
console.log(`Generated ${outputPath}`);

function required(name, value) {
  const normalized = value?.trim();
  if (!normalized) fail(`${name} is required.`);
  return normalized;
}

function cleanName(value) {
  const normalized = value?.trim();
  if (!normalized) return null;
  if (!/^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$/.test(normalized)) {
    fail(`Invalid Cloudflare resource name: ${normalized}`);
  }
  return normalized;
}

function normalizedTeamDomain(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    fail("CLOUDFLARE_ACCESS_TEAM_DOMAIN must be an HTTPS URL.");
  }
  if (
    url.protocol !== "https:" ||
    !url.hostname.endsWith(".cloudflareaccess.com") ||
    url.pathname !== "/"
  ) {
    fail(
      "CLOUDFLARE_ACCESS_TEAM_DOMAIN must look like https://team.cloudflareaccess.com",
    );
  }
  return url.origin;
}

function optionalDomains(value) {
  if (!value?.trim()) return [];
  const domains = value
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  if (new Set(domains).size !== domains.length) {
    fail("CLOUDFLARE_CUSTOM_DOMAINS contains duplicates.");
  }
  for (const domain of domains) {
    if (
      !/^(?=.{4,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(
        domain,
      )
    ) {
      fail(
        "CLOUDFLARE_CUSTOM_DOMAINS must contain comma-separated hostnames without schemes or paths.",
      );
    }
  }
  return domains;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
