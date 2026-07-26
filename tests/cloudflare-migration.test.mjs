import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

test("migration importer validates a complete backup without contacting Cloudflare", async () => {
  const directory = await mkdtemp(join(tmpdir(), "clinoro-import-test-"));
  const backupPath = join(directory, "backup.json");
  try {
    await writeFile(
      backupPath,
      JSON.stringify({
        format: "clinoro-cloudflare-migration",
        version: 1,
        siteContent: [
          {
            id: "primary",
            document: JSON.stringify({ title: "Clinoro's test" }),
            updated_at: 1,
          },
        ],
        adminUsers: [],
        rfqSubmissions: [],
        media: [],
      }),
    );

    const result = spawnSync(
      process.execPath,
      [
        "scripts/import-cloudflare-backup.mjs",
        backupPath,
        "--confirm-import",
        "--dry-run",
      ],
      { cwd: process.cwd(), encoding: "utf8", env: process.env },
    );
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Validated 1 content rows/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("migration importer rejects an unknown backup format", async () => {
  const directory = await mkdtemp(join(tmpdir(), "clinoro-import-test-"));
  const backupPath = join(directory, "backup.json");
  try {
    await writeFile(backupPath, JSON.stringify({ version: 99 }));
    const result = spawnSync(
      process.execPath,
      [
        "scripts/import-cloudflare-backup.mjs",
        backupPath,
        "--confirm-import",
        "--dry-run",
      ],
      { cwd: process.cwd(), encoding: "utf8", env: process.env },
    );
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Unsupported Clinoro migration backup/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
