import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const siteContent = sqliteTable("site_content", {
  id: text("id").primaryKey(),
  document: text("document").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const media = sqliteTable("media", {
  id: text("id").primaryKey(),
  objectKey: text("object_key").notNull(),
  filename: text("filename").notNull(),
  contentType: text("content_type").notNull(),
  size: integer("size").notNull(),
  createdAt: integer("created_at").notNull(),
});

export const adminUsers = sqliteTable("admin_users", {
  email: text("email").primaryKey(),
  username: text("username").notNull(),
  role: text("role").notNull().default("admin"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdBy: text("created_by").notNull(),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const rfqSubmissions = sqliteTable("rfq_submissions", {
  id: text("id").primaryKey(),
  reference: text("reference").notNull().unique(),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
  status: text("status").notNull().default("new"),
  name: text("name").notNull(),
  organization: text("organization").notNull().default(""),
  phone: text("phone").notNull(),
  email: text("email").notNull().default(""),
  topic: text("topic").notNull(),
  productSlug: text("product_slug").notNull().default(""),
  city: text("city").notNull().default(""),
  quantity: text("quantity").notNull().default(""),
  timeline: text("timeline").notNull().default(""),
  message: text("message").notNull(),
  consent: integer("consent", { mode: "boolean" }).notNull().default(false),
  sourceUrl: text("source_url").notNull().default(""),
  userAgent: text("user_agent").notNull().default(""),
}, table=>[
  index("rfq_created_at_idx").on(table.createdAt),
  index("rfq_status_idx").on(table.status),
]);

export const contentRevisions = sqliteTable("content_revisions", {
  id: text("id").primaryKey(),
  document: text("document").notNull(),
  note: text("note").notNull().default(""),
  createdBy: text("created_by").notNull(),
  createdAt: integer("created_at").notNull(),
  schemaVersion: integer("schema_version").notNull().default(1),
}, table=>[
  index("content_revisions_created_at_idx").on(table.createdAt),
]);
