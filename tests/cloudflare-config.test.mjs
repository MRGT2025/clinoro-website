import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

test("Cloudflare config is generated with dynamic account resources", async () => {
  const directory = await mkdtemp(join(tmpdir(), "clinoro-config-test-"));
  const output = join(directory, "wrangler.json");
  try {
    const result = spawnSync(
      process.execPath,
      ["scripts/render-cloudflare-config.mjs"],
      {
        cwd: process.cwd(),
        encoding: "utf8",
        env: {
          ...process.env,
          CLOUDFLARE_WRANGLER_CONFIG: output,
          CLOUDFLARE_D1_DATABASE_ID:
            "123e4567-e89b-42d3-a456-426614174000",
          CLOUDFLARE_ACCESS_TEAM_DOMAIN:
            "https://clinoro.cloudflareaccess.com",
          CLOUDFLARE_ACCESS_AUD:
            "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN",
          CLOUDFLARE_CUSTOM_DOMAINS:
            "clinoromedical.com,www.clinoromedical.com",
        },
      },
    );
    assert.equal(result.status, 0, result.stderr);

    const config = JSON.parse(await readFile(output, "utf8"));
    assert.equal(config.main, "../dist/server/index.js");
    assert.equal(config.assets.binding, "ASSETS");
    assert.equal(config.d1_databases[0].binding, "DB");
    assert.equal(config.r2_buckets[0].binding, "BUCKET");
    assert.equal(config.vars.AUTH_PROVIDER, "cloudflare-access");
    assert.deepEqual(
      config.routes.map((route) => route.pattern),
      ["clinoromedical.com", "www.clinoromedical.com"],
    );
    assert.equal("account_id" in config, false);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("Cloudflare config fails closed when identity settings are absent", () => {
  const result = spawnSync(
    process.execPath,
    ["scripts/render-cloudflare-config.mjs"],
    {
      cwd: process.cwd(),
      encoding: "utf8",
      env: {
        ...process.env,
        CLOUDFLARE_D1_DATABASE_ID:
          "123e4567-e89b-42d3-a456-426614174000",
        CLOUDFLARE_ACCESS_TEAM_DOMAIN: "",
        CLOUDFLARE_ACCESS_AUD: "",
      },
    },
  );
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /CLOUDFLARE_ACCESS_TEAM_DOMAIN is required/);
});
