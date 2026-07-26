import { NextResponse } from "next/server";
import { ensureDatabase, getD1 } from "../../../../db";
import { getAuthorizedAdmin } from "../../../../lib/admin-auth";

type SiteContentRow = {
  id: string;
  document: string;
  updated_at: number;
};

type AdminUserRow = {
  email: string;
  username: string;
  role: string;
  active: number;
  created_by: string;
  created_at: number;
  updated_at: number;
};

type RfqRow = {
  id: string;
  reference: string;
  created_at: number;
  updated_at: number;
  status: string;
  name: string;
  organization: string;
  phone: string;
  email: string;
  topic: string;
  product_slug: string;
  city: string;
  quantity: string;
  timeline: string;
  message: string;
  consent: number;
  source_url: string;
  user_agent: string;
};

type MediaRow = {
  id: string;
  object_key: string;
  filename: string;
  content_type: string;
  size: number;
  created_at: number;
};

export async function GET(request: Request) {
  const admin = await getAuthorizedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (admin.member.role !== "owner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await ensureDatabase();
  const db = getD1();
  const [siteContent, adminUsers, rfqSubmissions, media] = await Promise.all([
    db
      .prepare(
        "SELECT id, document, updated_at FROM site_content ORDER BY id ASC",
      )
      .all<SiteContentRow>(),
    db
      .prepare(
        "SELECT email, username, role, active, created_by, created_at, updated_at FROM admin_users ORDER BY created_at ASC",
      )
      .all<AdminUserRow>(),
    db
      .prepare(
        "SELECT id, reference, created_at, updated_at, status, name, organization, phone, email, topic, product_slug, city, quantity, timeline, message, consent, source_url, user_agent FROM rfq_submissions ORDER BY created_at ASC",
      )
      .all<RfqRow>(),
    db
      .prepare(
        "SELECT id, object_key, filename, content_type, size, created_at FROM media ORDER BY created_at ASC",
      )
      .all<MediaRow>(),
  ]);

  const origin = new URL(request.url).origin;
  const exportedAt = new Date().toISOString();
  const filename = `clinoro-migration-${exportedAt.slice(0, 10)}.json`;
  const body = {
    format: "clinoro-cloudflare-migration",
    version: 1,
    exportedAt,
    sourceOrigin: origin,
    siteContent: siteContent.results ?? [],
    adminUsers: adminUsers.results ?? [],
    rfqSubmissions: rfqSubmissions.results ?? [],
    media: (media.results ?? []).map((item) => ({
      ...item,
      source_url: `${origin}/api/media/${encodeURIComponent(item.id)}`,
    })),
  };

  return new NextResponse(JSON.stringify(body), {
    headers: {
      "Cache-Control": "private, no-store",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Type": "application/json; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
