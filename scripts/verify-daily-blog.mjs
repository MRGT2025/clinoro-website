import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const root = new URL("../", import.meta.url);
const DAY_MS = 86_400_000;

export function tehranDate(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tehran", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(now);
}

export function marketForDate(date) {
  const parsed = new Date(`${date}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(parsed.valueOf()) || parsed.toISOString().slice(0, 10) !== date) {
    throw new Error("Use a real calendar date in YYYY-MM-DD form");
  }
  return Math.round((parsed - new Date("2026-08-14T00:00:00Z")) / DAY_MS) % 2 === 0 ? "iran" : "global";
}

export function inspectDailyPost(source, date) {
  const market = marketForDate(date);
  if (!source) return { status: "needs_publication", date, market };
  const times = [...source.matchAll(/publishedTime:\s*"([^"]+)"/g)].map(match => match[1]);
  const slug = source.match(/\bslug:\s*"([^"]+)"/)?.[1];
  const image = source.match(/\bimage:\s*"([^"]+)"/)?.[1];
  const category = source.match(/\bcategory:\s*"([^"]+)"/)?.[1] ?? "";
  const title = source.match(/\btitle:\s*"([^"]+)"/)?.[1];
  const errors = [];
  if (times.length !== 1) errors.push("expected exactly one daily post");
  if (!new RegExp(`^${date}T\\d{2}:\\d{2}:\\d{2}\\+03:30$`).test(times[0] ?? "")) errors.push("wrong Tehran publication timestamp");
  if (!source.includes(`publishedAt: "${date}"`)) errors.push("wrong publication date");
  if (!slug || !/^[a-z0-9-]+$/.test(slug) || !title || !image?.startsWith("/assets/blog/")) errors.push("missing article identity or local image");
  if (market === "iran" ? !category.startsWith("ایران") : !/^(جهانی|بین‌المللی)/.test(category)) errors.push("wrong calendar-based market");
  if (!/published:\s*true/.test(source)) errors.push("article is not published");
  return { status: errors.length ? "source_invalid" : "source_ready", date, market, slug, image, title, publishedTime: times[0], errors };
}

export async function verifyLive(post, { fetcher = fetch, origin = "https://clinoromedical.com" } = {}) {
  if (post.status !== "source_ready") return post;
  const paths = { article: `/blog/${post.slug}`, blog: "/blog", home: "/", sitemap: "/sitemap.xml", image: post.image };
  const results = await Promise.all(Object.entries(paths).map(async ([name, path]) => {
    try {
      const response = await fetcher(`${origin}${path}`, { headers: { "Cache-Control": "no-cache" }, signal: AbortSignal.timeout(25000) });
      const type = response.headers.get("content-type") ?? "";
      const body = name === "image" ? new Uint8Array(await response.arrayBuffer()) : await response.text();
      return [name, { status: response.status, type, body }];
    } catch (error) { return [name, { status: 0, error: error.message }]; }
  }));
  const pages = Object.fromEntries(results);
  const article = typeof pages.article.body === "string" ? pages.article.body : "";
  const articlePath = `/blog/${post.slug}`;
  const canonical = `${origin}${articlePath}`;
  const bibliography = article.match(/<section class="blog-references"[^>]*>([\s\S]*?)<\/section>/)?.[1] ?? "";
  const body = article.match(/<div class="blog-article-body">([\s\S]*?)<\/div>/)?.[1] ?? "";
  const checks = {
    http200: Object.values(pages).every(page => page.status === 200),
    article: article.includes(post.title) && article.includes(post.publishedTime),
    canonical: article.includes(`rel="canonical" href="${canonical}"`),
    openGraph: article.includes(`property="og:url" content="${canonical}"`),
    jsonLd: article.includes('"@type":"Article"') && article.includes(`"datePublished":"${post.publishedTime}"`),
    home: typeof pages.home.body === "string" && pages.home.body.includes(articlePath),
    blog: typeof pages.blog.body === "string" && pages.blog.body.includes(articlePath),
    sitemap: typeof pages.sitemap.body === "string" && pages.sitemap.body.split(`<loc>${canonical}</loc>`).length === 2,
    cleanProse: Boolean(body) && !/href="https?:/.test(body),
    references: (bibliography.match(/<p>/g) ?? []).length === 1 && (bibliography.match(/href="https?:/g) ?? []).length >= 2,
    image: pages.image.type.startsWith("image/") && pages.image.body instanceof Uint8Array && pages.image.body.length > 0,
  };
  return { ...post, status: Object.values(checks).every(Boolean) ? "verified" : "pending_deployment", checks,
    responses: Object.fromEntries(results.map(([name, page]) => [name, { status: page.status, type: page.type, error: page.error }])) };
}

async function main() {
  const args = process.argv.slice(2);
  const dateFlag = args.indexOf("--date");
  const date = dateFlag >= 0 ? args[dateFlag + 1] : tehranDate();
  marketForDate(date);
  let source;
  try { source = await readFile(new URL(`lib/daily-blog-posts-${date}.ts`, root), "utf8"); }
  catch (error) { if (error.code !== "ENOENT") throw error; }
  let result = inspectDailyPost(source, date);
  if (!args.includes("--source-only")) result = await verifyLive(result);
  console.log(JSON.stringify(result, null, 2));
  process.exitCode = result.status === "verified" || (args.includes("--source-only") && result.status === "source_ready") ? 0 : result.status === "needs_publication" ? 2 : 3;
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
