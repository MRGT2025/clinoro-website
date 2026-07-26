import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";

const args = new Set(process.argv.slice(2));
const backupArgument = process.argv
  .slice(2)
  .find((value) => !value.startsWith("--"));

if (!backupArgument || !args.has("--confirm-import")) {
  console.error(
    "Usage: npm run cloudflare:import -- backup.json --confirm-import [--skip-media] [--dry-run]",
  );
  process.exit(64);
}

const backupPath = resolve(backupArgument);
const configPath = resolve(
  process.env.CLOUDFLARE_WRANGLER_CONFIG ??
    ".wrangler/clinoro-production.jsonc",
);
const bucketName = process.env.CLOUDFLARE_R2_BUCKET?.trim() || "clinoro-media";
const backup = JSON.parse(await readFile(backupPath, "utf8"));
validateBackup(backup);

const workspace = await mkdtemp(join(tmpdir(), "clinoro-cloudflare-import-"));
try {
  const sqlPath = join(workspace, "migration.sql");
  await writeFile(sqlPath, buildSql(backup), "utf8");

  if (args.has("--dry-run")) {
    console.log(
      `Validated ${backup.siteContent.length} content rows, ${backup.adminUsers.length} administrators, ${backup.rfqSubmissions.length} RFQs and ${backup.media.length} media objects.`,
    );
  } else {
    console.log("Importing D1 content, administrators, RFQs and media metadata...");
    await run("npx", [
      "wrangler",
      "d1",
      "execute",
      "DB",
      "--remote",
      "--yes",
      "--config",
      configPath,
      "--file",
      sqlPath,
    ]);

    if (!args.has("--skip-media")) {
      await importMedia(backup.media, bucketName, workspace);
    }

    console.log("Clinoro migration backup imported successfully.");
  }
} finally {
  await rm(workspace, { recursive: true, force: true });
}

function validateBackup(value) {
  if (
    value?.format !== "clinoro-cloudflare-migration" ||
    value?.version !== 1
  ) {
    throw new Error("Unsupported Clinoro migration backup.");
  }
  for (const key of [
    "siteContent",
    "adminUsers",
    "rfqSubmissions",
    "media",
  ]) {
    if (!Array.isArray(value[key])) {
      throw new Error(`Migration backup is missing ${key}.`);
    }
  }
}

function buildSql(value) {
  const statements = [
    ...value.siteContent.map(
      (row) =>
        `INSERT OR REPLACE INTO site_content (id, document, updated_at) VALUES (${sql(row.id)}, ${sql(row.document)}, ${integer(row.updated_at)});`,
    ),
    ...value.adminUsers.map(
      (row) =>
        `INSERT OR REPLACE INTO admin_users (email, username, role, active, created_by, created_at, updated_at) VALUES (${sql(row.email)}, ${sql(row.username)}, ${sql(row.role)}, ${integer(row.active)}, ${sql(row.created_by)}, ${integer(row.created_at)}, ${integer(row.updated_at)});`,
    ),
    ...value.rfqSubmissions.map(
      (row) =>
        `INSERT OR REPLACE INTO rfq_submissions (id, reference, created_at, updated_at, status, name, organization, phone, email, topic, product_slug, city, quantity, timeline, message, consent, source_url, user_agent) VALUES (${sql(row.id)}, ${sql(row.reference)}, ${integer(row.created_at)}, ${integer(row.updated_at)}, ${sql(row.status)}, ${sql(row.name)}, ${sql(row.organization)}, ${sql(row.phone)}, ${sql(row.email)}, ${sql(row.topic)}, ${sql(row.product_slug)}, ${sql(row.city)}, ${sql(row.quantity)}, ${sql(row.timeline)}, ${sql(row.message)}, ${integer(row.consent)}, ${sql(row.source_url)}, ${sql(row.user_agent)});`,
    ),
    ...value.media.map(
      (row) =>
        `INSERT OR REPLACE INTO media (id, object_key, filename, content_type, size, created_at) VALUES (${sql(row.id)}, ${sql(row.object_key)}, ${sql(row.filename)}, ${sql(row.content_type)}, ${integer(row.size)}, ${integer(row.created_at)});`,
    ),
  ];
  return `${statements.join("\n")}\n`;
}

async function importMedia(media, bucket, workspace) {
  for (const [index, item] of media.entries()) {
    const sourceUrl = new URL(item.source_url);
    if (sourceUrl.protocol !== "https:") {
      throw new Error(`Refusing non-HTTPS media URL for ${item.id}.`);
    }

    console.log(
      `Importing media ${index + 1}/${media.length}: ${item.filename}`,
    );
    const response = await fetch(sourceUrl, { redirect: "follow" });
    if (!response.ok) {
      throw new Error(
        `Could not download ${sourceUrl}: HTTP ${response.status}`,
      );
    }
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (Number(item.size) && bytes.byteLength !== Number(item.size)) {
      throw new Error(`Media size mismatch for ${item.id}.`);
    }

    const localPath = join(
      workspace,
      `${String(index).padStart(5, "0")}-${safeBasename(item.filename)}`,
    );
    await writeFile(localPath, bytes);
    await run("npx", [
      "wrangler",
      "r2",
      "object",
      "put",
      `${bucket}/${item.object_key}`,
      "--remote",
      "--force",
      "--file",
      localPath,
      "--content-type",
      item.content_type,
    ]);
  }
}

function sql(value) {
  return `'${String(value ?? "").replaceAll("'", "''")}'`;
}

function integer(value) {
  const number = Number(value);
  if (!Number.isSafeInteger(number)) {
    throw new Error(`Expected a safe integer, received ${value}.`);
  }
  return String(number);
}

function safeBasename(value) {
  return basename(String(value || "media"))
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .slice(-100);
}

function run(command, commandArgs) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, commandArgs, {
      cwd: process.cwd(),
      env: process.env,
      stdio: "inherit",
      shell: false,
    });
    child.once("error", reject);
    child.once("exit", (code) => {
      if (code === 0) resolvePromise();
      else reject(new Error(`${command} exited with code ${code}`));
    });
  });
}
