import { ensureDatabase, getD1 } from "../db";

export const OWNER_EMAIL = "reisi.general.trading@gmail.com";

export type AdminMember = {
  email: string;
  username: string;
  role: "owner" | "admin";
  active: boolean;
  createdAt: number;
};

type AdminRow = {
  email: string;
  username: string;
  role: string;
  active: number;
  created_at: number;
};

export function normalizeAdminEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function getAdminMember(email: string): Promise<AdminMember | null> {
  const normalized = normalizeAdminEmail(email);
  if (normalized === OWNER_EMAIL) {
    return { email: OWNER_EMAIL, username: "Mehrān Reisi", role: "owner", active: true, createdAt: 0 };
  }
  await ensureDatabase();
  const row = await getD1().prepare("SELECT email, username, role, active, created_at FROM admin_users WHERE email = ? AND active = 1")
    .bind(normalized).first<AdminRow>();
  return row ? toMember(row) : null;
}

export async function listAdminMembers(): Promise<AdminMember[]> {
  await ensureDatabase();
  const result = await getD1().prepare("SELECT email, username, role, active, created_at FROM admin_users ORDER BY created_at DESC").all<AdminRow>();
  return [
    { email: OWNER_EMAIL, username: "Mehrān Reisi", role: "owner", active: true, createdAt: 0 },
    ...(result.results ?? []).map(toMember),
  ];
}

export async function addAdminMember(input: { email: string; username: string; createdBy: string }) {
  const email = normalizeAdminEmail(input.email);
  const username = input.username.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("ایمیل معتبر نیست");
  if (email === OWNER_EMAIL) throw new Error("این ایمیل متعلق به مدیر اصلی است");
  if (username.length < 2 || username.length > 60) throw new Error("نام کاربری باید بین ۲ تا ۶۰ کاراکتر باشد");
  await ensureDatabase();
  const now = Date.now();
  await getD1().prepare("INSERT INTO admin_users (email, username, role, active, created_by, created_at, updated_at) VALUES (?, ?, 'admin', 1, ?, ?, ?) ON CONFLICT(email) DO UPDATE SET username = excluded.username, active = 1, updated_at = excluded.updated_at")
    .bind(email, username, normalizeAdminEmail(input.createdBy), now, now).run();
  return getAdminMember(email);
}

export async function removeAdminMember(email: string, actorEmail: string) {
  const normalized = normalizeAdminEmail(email);
  if (normalized === OWNER_EMAIL) throw new Error("مدیر اصلی قابل حذف نیست");
  if (normalized === normalizeAdminEmail(actorEmail)) throw new Error("نمی‌توانید حساب فعال خودتان را حذف کنید");
  await ensureDatabase();
  await getD1().prepare("DELETE FROM admin_users WHERE email = ?").bind(normalized).run();
}

function toMember(row: AdminRow): AdminMember {
  return {
    email: row.email,
    username: row.username,
    role: row.role === "owner" ? "owner" : "admin",
    active: Boolean(row.active),
    createdAt: row.created_at,
  };
}
