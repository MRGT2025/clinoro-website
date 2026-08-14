type ClinoroRuntimeEnv = {
  DB?: D1Database;
  BUCKET?: R2Bucket;
};

declare global {
  // The Worker entry sets these stable service bindings before routing a request.
  // Keeping them on globalThis also lets the build artifact stay importable by Node.
  var __CLINORO_RUNTIME_ENV: ClinoroRuntimeEnv | undefined;
}

function runtimeEnv() {
  return globalThis.__CLINORO_RUNTIME_ENV ?? {};
}

export function getD1() {
  const env = runtimeEnv();
  if (!env.DB) throw new Error("D1 binding DB is unavailable");
  return env.DB;
}

export function getMediaBucket() {
  const env = runtimeEnv();
  if (!env.BUCKET) throw new Error("R2 binding BUCKET is unavailable");
  return env.BUCKET;
}

let initialized: Promise<void> | null = null;
export function ensureDatabase() {
  if (!initialized) initialized = initializeDatabase();
  return initialized;
}

async function initializeDatabase() {
  const db = getD1();
  await db.batch([
    db.prepare("CREATE TABLE IF NOT EXISTS site_content (id TEXT PRIMARY KEY NOT NULL, document TEXT NOT NULL, updated_at INTEGER NOT NULL)"),
    db.prepare("CREATE TABLE IF NOT EXISTS media (id TEXT PRIMARY KEY NOT NULL, object_key TEXT NOT NULL, filename TEXT NOT NULL, content_type TEXT NOT NULL, size INTEGER NOT NULL, created_at INTEGER NOT NULL)"),
    db.prepare("CREATE TABLE IF NOT EXISTS admin_users (email TEXT PRIMARY KEY NOT NULL, username TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'admin', active INTEGER NOT NULL DEFAULT 1, created_by TEXT NOT NULL, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)"),
    db.prepare("CREATE TABLE IF NOT EXISTS rfq_submissions (id TEXT PRIMARY KEY NOT NULL, reference TEXT NOT NULL UNIQUE, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'new', name TEXT NOT NULL, organization TEXT NOT NULL DEFAULT '', phone TEXT NOT NULL, email TEXT NOT NULL DEFAULT '', topic TEXT NOT NULL, product_slug TEXT NOT NULL DEFAULT '', city TEXT NOT NULL DEFAULT '', quantity TEXT NOT NULL DEFAULT '', timeline TEXT NOT NULL DEFAULT '', message TEXT NOT NULL, consent INTEGER NOT NULL DEFAULT 0, source_url TEXT NOT NULL DEFAULT '', user_agent TEXT NOT NULL DEFAULT '')"),
    db.prepare("CREATE TABLE IF NOT EXISTS content_revisions (id TEXT PRIMARY KEY NOT NULL, document TEXT NOT NULL, note TEXT NOT NULL DEFAULT '', created_by TEXT NOT NULL, created_at INTEGER NOT NULL, schema_version INTEGER NOT NULL DEFAULT 1)"),
    db.prepare("CREATE INDEX IF NOT EXISTS media_created_at_idx ON media(created_at)"),
    db.prepare("CREATE INDEX IF NOT EXISTS admin_users_active_idx ON admin_users(active)"),
    db.prepare("CREATE INDEX IF NOT EXISTS rfq_created_at_idx ON rfq_submissions(created_at)"),
    db.prepare("CREATE INDEX IF NOT EXISTS rfq_status_idx ON rfq_submissions(status)"),
    db.prepare("CREATE INDEX IF NOT EXISTS content_revisions_created_at_idx ON content_revisions(created_at)"),
  ]);
}
