import { existsSync, readFileSync, readdirSync } from "node:fs";
import { extname, join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const errors = [];
const htmlFiles = readdirSync(root)
  .filter((file) => extname(file) === ".html")
  .sort();

const fail = (message) => errors.push(message);
const read = (file) => readFileSync(join(root, file), "utf8");
const isSkippableReference = (value) =>
  !value ||
  value.startsWith("#") ||
  /^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(value);

for (const file of htmlFiles) {
  const html = read(file);

  const runtimeRemoteDependency =
    /<(?:script|img|iframe|source|video|audio|link)\b[^>]*(?:src|href|poster)\s*=\s*["'](?:https?:)?\/\//i;
  if (runtimeRemoteDependency.test(html)) {
    fail(`${file}: remote runtime dependency found`);
  }

  const references = html.matchAll(
    /<(?:a|link|script|img|iframe|source|video|audio)\b[^>]*(?:href|src|poster)\s*=\s*["']([^"']+)["']/gi,
  );

  for (const [, rawReference] of references) {
    if (isSkippableReference(rawReference)) continue;
    const cleanReference = rawReference.split(/[?#]/, 1)[0];
    const target = resolve(root, cleanReference);
    if (!existsSync(target)) {
      fail(`${file}: missing local reference ${rawReference}`);
    }
  }
}

for (const directory of ["assets", "content"]) {
  const files = [];
  const visit = (path) => {
    for (const entry of readdirSync(path, { withFileTypes: true })) {
      const target = join(path, entry.name);
      if (entry.isDirectory()) visit(target);
      else files.push(target);
    }
  };
  visit(join(root, directory));

  for (const file of files) {
    if (!/\.(?:css|js|json)$/i.test(file)) continue;
    const source = readFileSync(file, "utf8");
    const remoteDependency =
      /(?:@import\s+(?:url\()?["']?(?:https?:)?\/\/|url\(\s*["']?(?:https?:)?\/\/|(?:src|href)\s*[:=]\s*["'](?:https?:)?\/\/)/i;
    if (remoteDependency.test(source)) {
      fail(`${file.slice(root.length + 1)}: remote dependency found`);
    }
  }
}

const blogIndex = read("blog.html");
const staticCards = blogIndex.match(/<article class="blog-card">/g) ?? [];
const blogPostFiles = htmlFiles.filter(
  (file) => file.startsWith("blog-") && file !== "blog.html",
);
const linkedPosts = new Set(
  [...blogIndex.matchAll(/href=["'](blog-[^"'?#]+\.html)["']/g)].map(
    ([, file]) => file,
  ),
);

if (staticCards.length !== blogPostFiles.length) {
  fail(
    `blog.html: expected ${blogPostFiles.length} static cards, found ${staticCards.length}`,
  );
}

for (const file of blogPostFiles) {
  if (!linkedPosts.has(file)) fail(`blog.html: missing static card for ${file}`);
  if (!/<article class="[^"]*\barticle-body\b[^"]*">/.test(read(file))) {
    fail(`${file}: article content is not present directly in HTML`);
  }
}

if (read("CNAME").trim() !== "clinoromedical.com") {
  fail("CNAME must contain only clinoromedical.com");
}

if (errors.length) {
  console.error(`Static-site validation failed:\n- ${errors.join("\n- ")}`);
  process.exit(1);
}

console.log(
  `Validated ${htmlFiles.length} HTML pages, ${staticCards.length} static blog cards, and all local runtime assets.`,
);
