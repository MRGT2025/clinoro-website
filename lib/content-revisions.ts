import { ensureDatabase, getD1 } from "../db";
import { normalizeSiteContent, type SiteContent } from "./site-content";

export type ContentRevisionSummary = {
  id: string;
  note: string;
  createdBy: string;
  createdAt: number;
  schemaVersion: number;
};

export async function publishContentRevision(
  content: SiteContent,
  createdBy: string,
  note: string,
) {
  await ensureDatabase();
  const id = crypto.randomUUID();
  const now = Date.now();
  const document = JSON.stringify(content);
  const upsert =
    "INSERT INTO site_content (id, document, updated_at) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET document = excluded.document, updated_at = excluded.updated_at";
  const db = getD1();
  await db.batch([
    db.prepare(upsert).bind("primary", document, now),
    db.prepare(upsert).bind("draft", document, now),
    db
      .prepare(
        "INSERT INTO content_revisions (id, document, note, created_by, created_at, schema_version) VALUES (?, ?, ?, ?, ?, ?)",
      )
      .bind(
        id,
        document,
        note.trim().slice(0, 180),
        createdBy,
        now,
        content.schemaVersion,
      ),
    db.prepare(
      "DELETE FROM content_revisions WHERE id NOT IN (SELECT id FROM content_revisions ORDER BY created_at DESC LIMIT 40)",
    ),
  ]);
  return { id, createdAt: now };
}

export async function listContentRevisions(limit = 30) {
  await ensureDatabase();
  const result = await getD1()
    .prepare(
      "SELECT id, note, created_by AS createdBy, created_at AS createdAt, schema_version AS schemaVersion FROM content_revisions ORDER BY created_at DESC LIMIT ?",
    )
    .bind(Math.max(1, Math.min(limit, 40)))
    .all<ContentRevisionSummary>();
  return result.results ?? [];
}

export async function getContentRevision(id: string) {
  await ensureDatabase();
  const row = await getD1()
    .prepare("SELECT document FROM content_revisions WHERE id = ?")
    .bind(id)
    .first<{ document: string }>();
  if (!row) return null;
  return normalizeSiteContent(JSON.parse(row.document) as Partial<SiteContent>);
}
