import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);
const env = {
  ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
};
const context = { waitUntil() {}, passThroughOnException() {} };
const request = (path) =>
  worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    env,
    context,
  );

test("RFQ endpoint validates and stores a real submission", async () => {
  const inserts = [];
  const db = {
    prepare(sql) {
      const statement = {
        args: [],
        bind(...args) {
          this.args = args;
          return this;
        },
        async first() {
          return sql.startsWith("SELECT COUNT") ? { total: 0 } : null;
        },
        async run() {
          if (sql.startsWith("INSERT INTO rfq_submissions"))
            inserts.push({ sql, args: this.args });
          return { meta: { changes: 1 } };
        },
        async all() {
          return { results: [] };
        },
      };
      return statement;
    },
    async batch() {
      return [];
    },
  };
  const response = await worker.fetch(
    new Request("http://localhost/api/rfq", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: "کاربر آزمایشی",
        organization: "مرکز تست",
        phone: "+98 913 000 0000",
        email: "test@example.com",
        topic: "استعلام محصول",
        productSlug: "icu-patient-monitor",
        city: "اصفهان",
        quantity: "2",
        timeline: "۱ تا ۳ ماه",
        message: "درخواست آزمایشی معتبر برای بررسی فنی محصول",
        consent: true,
        website: "",
        sourceUrl: "http://localhost/contact",
      }),
    }),
    { ...env, DB: db },
    context,
  );
  const result = await response.json();
  assert.equal(response.status, 201);
  assert.match(result.reference, /^CLN-\d{6}-[A-F0-9]{6}$/);
  assert.equal(inserts.length, 1);
  assert.equal(inserts[0].args[4], "کاربر آزمایشی");
});

test("home exposes production SEO and security metadata", async () => {
  const response = await request("/");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-frame-options"), "SAMEORIGIN");
  assert.match(
    response.headers.get("content-security-policy") ?? "",
    /frame-ancestors 'self'/,
  );
  assert.doesNotMatch(html, /codex-preview/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /Organization/);
  assert.match(html, /WebSite/);
  assert.match(html, /SearchAction/);
  assert.match(html, /clinoro-global-96-20260814/);
  assert.match(html, /rel="canonical" href="https:\/\/clinoromedical\.com\/"/);
  assert.match(html, /clinoro-hero-prism\.webp/);
  assert.match(html, /clinoro-logo-primary\.png/);
  assert.match(html, /clinoro-mark-primary\.png/);
  assert.match(html, /لوگوی Clinoro با نشانه پالس پزشکی و درگاه تجارت/);
  assert.match(html, /clinoro-wordmark-primary\.png/);
  assert.match(html, /class="brand-intro"/);
  assert.match(html, /PRECISION/);
  assert.match(html, /MEDICAL TECHNOLOGY/);
  assert.match(html, /COMMERCE/);
  assert.doesNotMatch(html, /clinoro-logo-minimal-grey\.png/);
});

test("manifest and document icons use the final Clinoro app mark", async () => {
  const response = await request("/manifest.webmanifest");
  const manifest = await response.json();
  assert.equal(response.status, 200);
  assert.equal(manifest.theme_color, "#081f3a");
  assert.equal(manifest.icons[0].src, "/assets/clinoro-app-icon.png");
  assert.match(manifest.icons[0].purpose, /maskable/);
});

test("catalog links to real product detail pages", async () => {
  const response = await request("/products");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /\/products\/icu-patient-monitor/);
  assert.match(html, /patient-monitor\.jpg/);
  assert.match(html, /تصویر مرجع/);
  assert.match(html, /مقایسه برای تصمیم خرید/);
  assert.match(html, /تا سه تجهیز را کنار هم بگذارید/);
  assert.match(html, /product-card-actions/);
  assert.match(html, /BUYER DECISION PROFILE/);
  assert.match(html, /کاتالوگ را بر اساس تصمیم خرید خودتان ببینید/);
  assert.match(html, /"@type":"ItemList"/);
  assert.match(html, /پوشش اطلاعات/);
});

test("design studio and responsive block canvas are wired to the shared content model", async () => {
  const [editor, contentModel, renderer, css] = await Promise.all([
    readFile(new URL("../app/admin/admin-editor.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/site-content.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/custom-content.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);
  assert.match(editor, /طراحی سایت/);
  assert.match(editor, /پیش‌نمایش زنده ادیت/);
  assert.match(editor, /onDragStart/);
  assert.match(editor, /پنهان در موبایل/);
  assert.match(editor, /Undo · Ctrl\/⌘ \+ Z/);
  assert.match(editor, /شدت موشن/);
  assert.match(editor, /تنظیم مستقل موبایل و تبلت/);
  assert.match(editor, /کتابخانه تم‌های خودتان/);
  assert.match(editor, /نسخه بین‌المللی/);
  assert.match(editor, /نسخه‌ها و انتشار/);
  assert.match(editor, /ذخیره پیش‌نویس/);
  assert.match(editor, /انتشار سایت/);
  assert.match(editor, /پیش‌نویس منتشرنشده/);
  assert.match(editor, /preview-inline-edit/);
  assert.match(contentModel, /schemaVersion:\s*19/);
  assert.match(contentModel, /ProductInternational/);
  assert.match(contentModel, /ProductInternationalProcurement/);
  assert.match(contentModel, /ProductProcurement/);
  assert.match(contentModel, /saveDraftSiteContent/);
  assert.match(contentModel, /stripCodeInjections/);
  assert.match(contentModel, /faFont:/);
  assert.match(contentModel, /mediaAspect:/);
  assert.match(contentModel, /mobileTitleSize:/);
  assert.match(contentModel, /backgroundStyle:/);
  assert.match(contentModel, /designLibrary:/);
  assert.match(renderer, /cms-hide-mobile/);
  assert.match(renderer, /cms-layout-/);
  assert.match(renderer, /block-mobile-title-size/);
  assert.match(css, /data-card-style="outline"/);
  assert.match(css, /\.compare-dialog/);
  assert.match(css, /\.decision-studio/);
  assert.match(css, /\.trust-protocol/);
  assert.match(css, /\.decision-pack-workspace/);
  assert.match(css, /\.global-hero/);
  assert.match(css, /\.revision-list/);
});

test("admin publishing workflow persists drafts and recoverable revisions", async () => {
  const [contentRoute, revisionRoute, revisionStore, migration] = await Promise.all([
    readFile(new URL("../app/api/admin/content/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/admin/revisions/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/content-revisions.ts", import.meta.url), "utf8"),
    readFile(new URL("../drizzle/0004_brainy_puma.sql", import.meta.url), "utf8"),
  ]);
  assert.match(contentRoute, /mode===\"draft\"/);
  assert.match(contentRoute, /publishContentRevision/);
  assert.match(contentRoute, /normalizeSiteContent/);
  assert.match(revisionStore, /db\.prepare\(upsert\)\.bind\("primary"/);
  assert.match(revisionStore, /db\.prepare\(upsert\)\.bind\("draft"/);
  assert.match(revisionRoute, /getContentRevision/);
  assert.match(revisionRoute, /stripCodeInjections/);
  assert.match(revisionStore, /LIMIT 40/);
  assert.match(migration, /CREATE TABLE `content_revisions`/);
  assert.match(migration, /content_revisions_created_at_idx/);
});

test("home renders the interactive decision and documented trust layers", async () => {
  const response = await request("/");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /CLINORO DECISION STUDIO/);
  assert.match(html, /قبل از دیدن کاتالوگ، مسیر خرید را روشن کنید/);
  assert.match(html, /VERIFIED PROCUREMENT PROTOCOL/);
  assert.match(html, /اعتماد، یک ادعا نیست؛ یک زنجیره قابل پیگیری است/);
  assert.match(html, /مرکز اسناد و اعتماد/);
});

test("document titles carry the Clinoro brand exactly once", async () => {
  const paths = [
    "/products/icu-patient-monitor",
    "/credentials",
    "/blog/qmsr-supplier-quality-2026",
    "/privacy",
    "/terms",
  ];
  for (const path of paths) {
    const response = await request(path);
    const html = await response.text();
    assert.equal(response.status, 200, path);
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1] ?? "";
    assert.match(title, /Clinoro/, path);
    assert.doesNotMatch(title, /Clinoro\s*\|\s*Clinoro/i, path);
    assert.equal((title.match(/Clinoro/gi) ?? []).length, 1, path);
  }
});

test("blog posts are present in initial HTML without client-side filtering", async () => {
  const response = await request("/blog");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.equal((html.match(/<article class="blog-card/g) ?? []).length, 48);
  assert.match(html, /قیمت مگنت، قیمت پروژه نیست؛ ۱۲ کنترل خرید MRI پیش از اولین اسکن/);
  assert.match(html, /مود بیشتر، ونتیلاتور بهتر نیست؛ ۱۲ آزمون خرید و تحویل در ایران/);
  assert.match(html, /ربات جراحی خودش جراحی نمی‌کند؛ ۱۲ کنترل خرید پیش از اولین عمل/);
  assert.match(html, /آبِ خوب، آپشن نیست؛ ۱۲ کنترل خرید دستگاه دیالیز و RO در ایران/);
  assert.match(html, /دستگاه رایگان نیست؛ ۱۲ بند قرارداد Reagent Rental برای آزمایشگاه/);
  assert.match(html, /فقط اتوکلاو نخرید؛ ۱۲ کنترل خرید استریلایزر بخار و CSSD در ایران/);
  assert.match(html, /AI Act عقب افتاد، ریسک خرید نه؛ ۱۲ مدرک/);
  assert.match(html, /اول اتاق، بعد دستگاه؛ ۱۲ کنترل خرید CT و رادیولوژی در ایران/);
  assert.match(html, /استوک، دست‌دوم یا Refurbished؟ ۱۲ کنترل/);
  assert.match(html, /تجهیز بیمارستانی را به خانه نبرید؛ ۱۲ کنترل خرید/);
  assert.match(html, /HL7\/FHIR روی بروشور کافی نیست؛ ۱۲ آزمون اتصال/);
  assert.match(html, /برق، ارت و UPS تجهیزات پزشکی در ایران؛ ۱۲ آزمون/);
  assert.match(html, /eIFU تجهیزات پزشکی در اروپا؛ ۱۰ کنترل خرید/);
  assert.match(html, /خدمات پس از فروش تجهیزات پزشکی در ایران؛ ۱۲ بند قرارداد/);
  assert.match(html, /انبار تجهیزات پزشکی در ایران؛ ۱۲ کنترل/);
  assert.match(html, /هر صدایی هشدار حیاتی نیست؛ ۱۰ کنترل/);
  assert.match(html, /اکسیژن‌ساز بیمارستانی در ایران؛ ۱۲ کنترل/);
  assert.match(html, /تجهیز پزشکی امانی وارد اتاق عمل می‌شود/);
  assert.match(html, /کالیبراسیون تجهیزات پزشکی در ایران؛ ۹ کنترل/);
  assert.match(html, /تجهیز پزشکی را چه زمانی از رده خارج کنیم؟/);
  assert.match(html, /خرید تجهیزات پزشکی در ایران؛ ۱۰ مدرک/);
  assert.match(html, /دستگاه پزشکی مبتنی بر AI بعداً تغییر می‌کند/);
  assert.match(html, /تعمیر یا بازساخت؟ ۱۱ بند حیاتی/);
  assert.match(html, /خرابی تجهیز را فقط تعمیر نکنید/);
  assert.match(html, /EUDAMED از مه ۲۰۲۶ اجباری شد/);
  assert.match(html, /آنالایزر آزمایشگاهی را تحویل گرفتید/);
  assert.match(html, /کمبود تجهیزات پزشکی در ۲۰۲۶/);
  assert.match(html, /خرید تجهیز چندبارمصرف بدون برنامه بازفرآوری/);
  assert.match(html, /QMSR از ۲۰۲۶ اجرایی شد/);
  assert.match(html, /از اکسل تا CMMS/);
  assert.match(html, /ثبت تجهیزات پزشکی در بریتانیای کبیر/);
  assert.match(html, /WHO Listed Authorities برای تجهیزات پزشکی/);
  assert.doesNotMatch(html, /aria-live="polite"/);
  assert.doesNotMatch(html, /هنوز مطلبی منتشر نشده است/);
});

test("all reveal content stays visible without JavaScript or an observer", async () => {
  const css = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );
  const experience = await readFile(
    new URL("../app/experience.tsx", import.meta.url),
    "utf8",
  );
  const intro = await readFile(
    new URL("../app/brand-intro.tsx", import.meta.url),
    "utf8",
  );
  assert.match(
    css,
    /\.motion-ready \.motion-section,\.motion-ready \[data-reveal\]\{opacity:1;visibility:visible;transform:none;filter:none;scale:1/,
  );
  assert.doesNotMatch(
    css,
    /\.motion-ready \.motion-section,\.motion-ready \[data-reveal\]\{[^}]*opacity:0/,
  );
  assert.doesNotMatch(experience, /IntersectionObserver/);
  assert.match(intro, /sessionStorage\.setItem\(INTRO_KEY,"seen"\)/);
  assert.match(intro, /prefers-reduced-motion: reduce/);
});

test("new Clinoro V35 article renders complete server HTML", async () => {
  const response = await request("/blog/mhra-device-registration-2026");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /تفاوت «عرضه به بازار» و «به‌خدمت‌گیری»/);
  assert.match(html, /چک‌لیست عملی برای پرونده تأمین/);
  assert.match(html, /راهنمای ثبت تجهیزات پزشکی MHRA/);
});

test("daily QMSR article includes complete SSR content, SEO and licensed local image", async () => {
  const response = await request("/blog/qmsr-supplier-quality-2026");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /۱۲ مدرکی که باید در ارزیابی بررسی شوند/);
  assert.match(html, /توافق کیفیت را از قرارداد تجاری جدا نکنید/);
  assert.match(html, /href="\/procurement"/);
  assert.match(html, /qmsr-quality-system-2026\.jpg/);
  assert.match(html, /CC BY 2\.0/);
  assert.match(html, /\"@type\":\"Article\"/);
  assert.match(html, /2026-07-27T08:05:00\+04:00/);
  assert.match(
    html,
    /rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/qmsr-supplier-quality-2026"/,
  );
});

test("daily WHO CMMS article includes complete SSR content, SEO and licensed local image", async () => {
  const response = await request("/blog/medical-device-cmms-who-2025");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /شناسنامه حداقلی هر تجهیز/);
  assert.match(html, /برنامه عملی برای شروع/);
  assert.match(
    html,
    /href="\/blog\/medical-equipment-total-cost-of-ownership"/,
  );
  assert.match(html, /medical-device-cmms-who-2025\.jpg/);
  assert.match(html, /Public Domain/);
  assert.match(html, /\"@type\":\"Article\"/);
  assert.match(
    html,
    /rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/medical-device-cmms-who-2025"/,
  );
});

test("daily supply resilience article includes complete SSR content, current sources and local image", async () => {
  const response = await request(
    "/blog/medical-device-shortage-continuity-2026",
  );
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /هشت داده‌ای که هر قلم بحرانی باید داشته باشد/);
  assert.match(html, /سناریوی ۳۰، ۶۰ و ۹۰ روزه/);
  assert.match(html, /href="\/procurement"/);
  assert.match(html, /medical-device-supply-resilience-2026\.jpg/);
  assert.match(html, /Public Domain/);
  assert.match(html, /\"@type\":\"Article\"/);
  assert.match(html, /2026-07-28T08:01:00\+04:00/);
  assert.match(
    html,
    /rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/medical-device-shortage-continuity-2026"/,
  );
});

test("daily reusable-device article includes complete SSR content, SEO and licensed local image", async () => {
  const response = await request("/blog/reusable-device-reprocessing");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /۱۴ سؤال پیش از امضای قرارداد/);
  assert.match(html, /ظرفیت واقعی CSSD را محاسبه کنید/);
  assert.match(html, /href="\/products\/medical-autoclave"/);
  assert.match(html, /reusable-device-reprocessing\.jpg/);
  assert.match(html, /Public Domain/);
  assert.match(html, /\"@type\":\"Article\"/);
  assert.match(html, /2026-07-28T08:01:00\+04:00/);
  assert.match(
    html,
    /rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/reusable-device-reprocessing"/,
  );
});

test("daily EUDAMED article includes complete SSR content, SEO and licensed local image", async () => {
  const response = await request("/blog/eudamed-procurement-2026");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /۱۰ کنترل پیش از قرارداد/);
  assert.match(html, /یک ماتریس ساده برای پرونده تأمین/);
  assert.match(html, /href="\/procurement"/);
  assert.match(html, /eudamed-procurement-2026\.jpg/);
  assert.match(html, /Public Domain/);
  assert.match(html, /\"@type\":\"Article\"/);
  assert.match(html, /2026-07-29T07:59:00\+04:00/);
  assert.match(
    html,
    /rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/eudamed-procurement-2026"/,
  );
});

test("daily laboratory acceptance article includes complete SSR content, SEO and licensed local image", async () => {
  const response = await request("/blog/lab-analyzer-acceptance");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /۱۲ آزمون و کنترل پیش از Go-Live/);
  assert.match(html, /معیار قبولی را قبل از نتیجه بنویسید/);
  assert.match(html, /href="\/products\/hematology-analyzer"/);
  assert.match(html, /lab-analyzer-acceptance\.jpg/);
  assert.match(html, /Public Domain/);
  assert.match(html, /\"@type\":\"Article\"/);
  assert.match(html, /2026-07-29T07:59:00\+04:00/);
  assert.match(
    html,
    /rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/lab-analyzer-acceptance"/,
  );
});

test("daily servicing article includes complete SSR content, SEO and licensed local image", async () => {
  const response = await request("/blog/servicing-vs-remanufacturing");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /۱۱ بند حیاتی در قرارداد سرویس/);
  assert.match(html, /آزمون شش‌سؤالی پیش از صدور سفارش کار/);
  assert.match(
    html,
    /href="\/blog\/connected-medical-device-cybersecurity-checklist-2026"/,
  );
  assert.match(html, /servicing-vs-remanufacturing\.jpg/);
  assert.match(html, /Public Domain/);
  assert.match(html, /\"@type\":\"Article\"/);
  assert.match(html, /2026-07-30T08:01:00\+04:00/);
  assert.match(
    html,
    /rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/servicing-vs-remanufacturing"/,
  );
});

test("daily adverse-event article includes complete SSR content, SEO and licensed local image", async () => {
  const response = await request("/blog/medical-device-adverse-event-file");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /۱۲ داده‌ای که پرونده باید داشته باشد/);
  assert.match(html, /یک گردش‌کار پنج‌مرحله‌ای/);
  assert.match(html, /href="\/blog\/medical-device-cmms-who-2025"/);
  assert.match(html, /medical-device-adverse-event-file\.jpg/);
  assert.match(html, /Public Domain/);
  assert.match(html, /\"@type\":\"Article\"/);
  assert.match(html, /2026-07-30T08:01:00\+04:00/);
  assert.match(
    html,
    /rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/medical-device-adverse-event-file"/,
  );
});

test("daily Iran procurement article includes complete SSR content, Iranian primary sources and licensed local image", async () => {
  const response = await request("/blog/iran-medical-device-procurement");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /۱۰ مدرک پیش از پرداخت و تحویل/);
  assert.match(html, /سه نقطه توقف در فرآیند خرید/);
  assert.match(html, /href="\/procurement"/);
  assert.match(html, /qavanin\.ir\/Law\/TreeText/);
  assert.match(html, /fdo\.tums\.ac\.ir/);
  assert.match(html, /iran-medical-device-procurement\.jpg/);
  assert.match(html, /Public Domain/);
  assert.match(html, /"@type":"Article"/);
  assert.match(html, /2026-07-31T08:01:00\+04:00/);
  assert.match(
    html,
    /rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/iran-medical-device-procurement"/,
  );
});

test("daily AI PCCP article includes complete SSR content, international primary sources and licensed local image", async () => {
  const response = await request("/blog/ai-device-pccp-procurement");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /۹ سؤال پیش از امضای قرارداد/);
  assert.match(html, /پیوست تغییر نرم‌افزار در قرارداد/);
  assert.match(html, /href="\/blog\/ai-medical-imaging-procurement-checklist"/);
  assert.match(
    html,
    /predetermined-change-control-plan-artificial-intelligence/,
  );
  assert.match(html, /ai-device-pccp-procurement\.jpg/);
  assert.match(html, /Public Domain/);
  assert.match(html, /"@type":"Article"/);
  assert.match(html, /2026-07-31T08:01:00\+04:00/);
  assert.match(
    html,
    /rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/ai-device-pccp-procurement"/,
  );
});

test("daily Iran calibration article includes complete SSR content, Iranian official sources and licensed local image", async () => {
  const response = await request("/blog/iran-medical-device-calibration");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /۹ کنترل برای یک برنامه قابل‌دفاع/);
  assert.match(html, /حداقل اقلام گزارش تحویلی/);
  assert.match(html, /href="\/blog\/medical-device-cmms-who-2025"/);
  assert.match(html, /qavanin\.ir\/Law\/TreeText/);
  assert.match(html, /sthn\.tums\.ac\.ir/);
  assert.match(html, /vc-food-drug\.kums\.ac\.ir/);
  assert.match(html, /iran-medical-device-calibration\.jpg/);
  assert.match(html, /Public Domain/);
  assert.match(html, /"@type":"Article"/);
  assert.match(html, /2026-08-01T08:00:00\+04:00/);
  assert.match(
    html,
    /rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/iran-medical-device-calibration"/,
  );
});

test("daily decommissioning article includes complete SSR content, international primary sources and licensed local image", async () => {
  const response = await request("/blog/medical-device-decommissioning");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /۱۰ گام برای خروج ایمن و قابل‌پیگیری/);
  assert.match(html, /چهار خط قرمز/);
  assert.match(
    html,
    /href="\/blog\/connected-medical-device-cybersecurity-checklist-2026"/,
  );
  assert.match(html, /who\.int\/publications\/i\/item\/9789241517041/);
  assert.match(html, /Managing_medical_devices\.pdf/);
  assert.match(html, /medical-device-decommissioning\.jpg/);
  assert.match(html, /Public Domain/);
  assert.match(html, /"@type":"Article"/);
  assert.match(html, /2026-08-01T08:00:00\+04:00/);
  assert.match(
    html,
    /rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/medical-device-decommissioning"/,
  );
});

test("daily Iran oxygen-concentrator article includes complete SSR content, Iranian official sources and licensed local image", async () => {
  const response = await request("/blog/iran-hospital-oxygen-concentrator");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /۱۲ کنترل برای بهره‌برداری قابل‌دفاع/);
  assert.match(html, /سه سطح اقدام برای نتیجه نامطلوب/);
  assert.match(html, /href="\/blog\/medical-device-cmms-who-2025"/);
  assert.match(html, /ta\.mui\.ac\.ir/);
  assert.match(html, /qavanin\.ir\/Law\/TreeText/);
  assert.match(html, /iran-hospital-oxygen-concentrator\.jpg/);
  assert.match(html, /Public Domain/);
  assert.match(html, /"@type":"Article"/);
  assert.match(html, /2026-08-02T08:00:00\+04:00/);
  assert.match(
    html,
    /rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/iran-hospital-oxygen-concentrator"/,
  );
});

test("daily loan-medical-device article includes complete SSR content, current international sources and licensed local image", async () => {
  const response = await request("/blog/loan-medical-device-control");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /۱۲ کنترل پیش از ورود به چرخه بالینی/);
  assert.match(html, /چه زمانی دستگاه امانی را نپذیریم؟/);
  assert.match(
    html,
    /href="\/blog\/medical-equipment-total-cost-of-ownership"/,
  );
  assert.match(html, /shtm-01-08-v1-sept-2025\.pdf/);
  assert.match(html, /Managing_medical_devices\.pdf/);
  assert.match(html, /loan-medical-device-control\.jpg/);
  assert.match(html, /Public Domain/);
  assert.match(html, /"@type":"Article"/);
  assert.match(html, /2026-08-02T08:00:00\+04:00/);
  assert.match(
    html,
    /rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/loan-medical-device-control"/,
  );
});

test("daily Iran warehouse article includes complete SSR content, Iranian official sources and licensed local image", async () => {
  const response = await request("/blog/iran-medical-device-warehouse");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /۱۲ کنترل برای یک انبار قابل‌دفاع/);
  assert.match(html, /پنج شاخص برای جلسه ماهانه/);
  assert.match(html, /href="\/blog\/medical-device-recall-readiness"/);
  assert.match(html, /fdo\.mui\.ac\.ir/);
  assert.match(html, /fdo\.tums\.ac\.ir/);
  assert.match(html, /md\.bpums\.ac\.ir/);
  assert.match(html, /iran-medical-device-warehouse\.jpg/);
  assert.match(html, /Public Domain/);
  assert.match(html, /"@type":"Article"/);
  assert.match(html, /2026-08-03T08:00:00\+04:00/);
  assert.match(
    html,
    /rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/iran-medical-device-warehouse"/,
  );
});

test("daily Iran after-sales contract article includes complete SSR, Tehran timestamp and SEO metadata", async () => {
  const response = await request(
    "/blog/iran-medical-device-after-sales-service-contract",
  );
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /۱۲ بند حیاتی قرارداد خدمات پس از فروش/);
  assert.match(html, /ماتریس امتیازدهی که قیمت را از تصمیم جدا نمی‌کند/);
  assert.match(html, /href="\/procurement"/);
  assert.match(html, /href="\/contact"/);
  assert.match(html, /qavanin\.ir\/Law\/TreeText/);
  assert.match(html, /dotic\.ir\/news\/2293/);
  assert.match(html, /iran-medical-device-after-sales-service-contract\.webp/);
  assert.match(html, /تصویر تولیدشده برای Clinoro/);
  assert.match(html, /"@type":"Article"/);
  assert.match(html, /"articleSection":"ایران؛ خرید و خدمات"/);
  assert.match(
    html,
    /<meta name="keywords" content="خدمات پس از فروش تجهیزات پزشکی,قرارداد تجهیزات پزشکی/,
  );
  assert.match(html, /خدمات پس از فروش تجهیزات پزشکی, قرارداد تجهیزات پزشکی/);
  assert.match(html, /2026-08-14T08:00:00\+03:30/);
  assert.match(
    html,
    /rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/iran-medical-device-after-sales-service-contract"/,
  );
});

test("daily EU eIFU article includes complete SSR, primary sources and buyer controls", async () => {
  const response = await request(
    "/blog/eu-medical-device-eifu-procurement-2026",
  );
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /۱۰ کنترل خریدار پیش از قرارداد/);
  assert.match(html, /آزمون ۳۰ دقیقه‌ای هنگام تحویل/);
  assert.match(html, /حداکثر ظرف هفت روز تقویمی/);
  assert.match(html, /href="\/procurement"/);
  assert.match(html, /href="\/contact"/);
  assert.match(html, /eur-lex\.europa\.eu\/legal-content\/EN\/TXT\/HTML/);
  assert.match(html, /health\.ec\.europa\.eu\/latest-updates/);
  assert.match(html, /eu-medical-device-eifu-procurement-2026\.webp/);
  assert.match(html, /تصویر تولیدشده برای Clinoro/);
  assert.match(html, /"@type":"Article"/);
  assert.match(html, /"articleSection":"جهانی؛ مقررات و بهره‌برداری"/);
  assert.match(
    html,
    /<meta name="keywords" content="eIFU تجهیزات پزشکی,راهنمای الکترونیکی تجهیزات پزشکی/,
  );
  assert.match(html, /2026-08-15T08:00:00\+03:30/);
  assert.match(
    html,
    /rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/eu-medical-device-eifu-procurement-2026"/,
  );
});

test("daily Iran electrical site-readiness article includes SSR, primary sources, Tehran timestamp and buyer controls", async () => {
  const response = await request(
    "/blog/iran-medical-equipment-electrical-site-readiness",
  );
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /۱۲ آزمون و مدرک پیش از تحویل/);
  assert.match(html, /پنج خط قرمز برای توقف تحویل/);
  assert.match(html, /Site Readiness Sheet/);
  assert.match(html, /href="\/procurement"/);
  assert.match(html, /href="\/contact"/);
  assert.match(html, /fdo\.tums\.ac\.ir\/uploads\/282\/2024\/May\/12\/stnbook2\.pdf/);
  assert.match(html, /standard\.ac\.ir\/fa\/introduction\/researchinstitutes/);
  assert.match(html, /iec\.ch\/government-regulators\/medical-devices/);
  assert.match(html, /who\.int\/publications\/i\/item\/9789241501378/);
  assert.match(html, /iran-medical-equipment-electrical-site-readiness\.webp/);
  assert.match(html, /تصویر تولیدشده برای Clinoro/);
  assert.match(html, /"@type":"Article"/);
  assert.match(html, /"articleSection":"ایران؛ زیرساخت، ایمنی و خرید"/);
  assert.match(
    html,
    /<meta name="keywords" content="برق تجهیزات پزشکی,UPS تجهیزات پزشکی,ارت تجهیزات پزشکی/,
  );
  assert.match(html, /2026-08-16T08:00:00\+03:30/);
  assert.match(
    html,
    /rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/iran-medical-equipment-electrical-site-readiness"/,
  );
});

test("daily medical-device interoperability article includes SSR, current primary sources, Tehran timestamp and buyer acceptance controls", async () => {
  const response = await request(
    "/blog/medical-device-interoperability-acceptance-2026",
  );
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /۱۲ آزمون اتصال پیش از Go-Live/);
  assert.match(html, /پنج خط قرمز برای توقف Go-Live/);
  assert.match(html, /Reconciliation عددی/);
  assert.match(html, /href="\/procurement"/);
  assert.match(html, /href="\/contact"/);
  assert.match(html, /fda\.gov\/media\/95636\/download/);
  assert.match(html, /hl7\.org\/fhir/);
  assert.match(html, /profiles\.ihe\.net\/DEV\/SDPi/);
  assert.match(html, /nccoe\.nist\.gov\/publication\/1800-24/);
  assert.match(html, /medical-device-interoperability-acceptance-2026\.webp/);
  assert.match(html, /تصویر تولیدشده برای Clinoro/);
  assert.match(html, /"@type":"Article"/);
  assert.match(
    html,
    /"articleSection":"جهانی؛ سلامت دیجیتال و یکپارچه‌سازی"/,
  );
  assert.match(
    html,
    /<meta name="keywords" content="اتصال تجهیزات پزشکی به HIS,HL7 تجهیزات پزشکی,FHIR تجهیزات پزشکی/,
  );
  assert.match(html, /2026-08-17T08:00:00\+03:30/);
  assert.match(
    html,
    /rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/medical-device-interoperability-acceptance-2026"/,
  );
});

test("daily home-healthcare procurement article includes SSR, primary sources, Tehran metadata and home acceptance controls", async () => {
  const response = await request(
    "/blog/home-healthcare-medical-device-procurement-2026",
  );
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /۱۲ کنترل خرید تجهیزات مراقبت خانگی/);
  assert.match(html, /آزمون پذیرش در خانه؛ نه در نمایشگاه/);
  assert.match(html, /شش خط قرمز پیش از سفارش/);
  assert.match(html, /href="\/procurement"/);
  assert.match(html, /href="\/contact"/);
  assert.match(html, /fda\.gov\/medical-devices\/home-health-care-hub\/fda-readi-home/);
  assert.match(html, /fda\.gov\/medical-devices\/home-health-care-hub\/idea-lab/);
  assert.match(html, /webstore\.iec\.ch\/en\/publication\/67384/);
  assert.match(html, /csrc\.nist\.gov\/pubs\/sp\/1800\/30\/final/);
  assert.match(html, /home-healthcare-medical-device-procurement-2026\.webp/);
  assert.match(html, /تصویر تولیدشده برای Clinoro/);
  assert.match(html, /"@type":"Article"/);
  assert.match(html, /"articleSection":"جهانی؛ مراقبت خانگی و ایمنی"/);
  assert.match(
    html,
    /<meta name="keywords" content="خرید تجهیزات پزشکی خانگی,تجهیزات مراقبت در منزل,استاندارد تجهیزات پزشکی خانگی/,
  );
  assert.match(html, /2026-08-21T08:00:00\+03:30/);
  assert.match(
    html,
    /rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/home-healthcare-medical-device-procurement-2026"/,
  );
});

test("daily Iran used and refurbished device article includes SSR, primary sources, legal nuance and buyer controls", async () => {
  const response = await request(
    "/blog/iran-used-refurbished-medical-device-procurement",
  );
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /استوک، دست‌دوم یا Refurbished؟/);
  assert.match(html, /ماده ۵۶/);
  assert.match(html, /ماده ۵۷/);
  assert.match(html, /هر معامله داخلی/);
  assert.match(html, /۱۲ کنترل پیش از سفارش/);
  assert.match(html, /سه دروازه تصمیم/);
  assert.match(html, /qavanin\.ir\/Law\/TreeText/);
  assert.match(html, /fdo\.mui\.ac\.ir/);
  assert.match(html, /who\.int\/publications/);
  assert.match(html, /fda\.gov\/medical-devices/);
  assert.match(html, /iran-used-refurbished-medical-device-procurement\.webp/);
  assert.match(html, /2026-08-22T08:00:00\+03:30/);
  assert.match(
    html,
    /rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/iran-used-refurbished-medical-device-procurement"/,
  );
  assert.match(html, /"@type":"Article"/);
});

test("daily EU MDR legacy-device article includes SSR, current primary sources, transition evidence and buyer controls", async () => {
  const response = await request(
    "/blog/eu-mdr-legacy-device-procurement-2026",
  );
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /CE قدیمی هنوز معتبر است؟/);
  assert.match(html, /۱۲ مدرک قبل از سفارش/);
  assert.match(html, /۳۱ دسامبر ۲۰۲۷/);
  assert.match(html, /۳۱ دسامبر ۲۰۲۸/);
  assert.match(html, /۲۶ سپتامبر ۲۰۲۴/);
  assert.match(html, /تغییر مهم/);
  assert.match(html, /ماده 10a/);
  assert.match(html, /eur-lex\.europa\.eu\/eli\/reg\/2023\/607/);
  assert.match(html, /mdcg_2020-3_en_1\.pdf/);
  assert.match(html, /md_mdcg_2021_25_en\.pdf/);
  assert.match(html, /mdr_qna-article10a_mdr-ivdr_en\.pdf/);
  assert.match(html, /href="\/procurement"/);
  assert.match(html, /href="\/contact"/);
  assert.match(html, /eu-mdr-legacy-device-procurement-2026\.webp/);
  assert.match(html, /تصویر تولیدشده برای Clinoro/);
  assert.match(html, /2026-08-23T08:00:00\+03:30/);
  assert.match(html, /"@type":"Article"/);
  assert.match(
    html,
    /"articleSection":"جهانی؛ مقررات اروپا و انطباق خرید"/,
  );
  assert.match(
    html,
    /<meta name="keywords" content="تجهیزات پزشکی Legacy اروپا,MDR 2027 2028,اعتبار گواهی CE تجهیزات پزشکی/,
  );
  assert.match(
    html,
    /rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/eu-mdr-legacy-device-procurement-2026"/,
  );
});

test("daily Iran CT and X-ray procurement article includes SSR, legal sources, Tehran metadata and site-readiness controls", async () => {
  const response = await request(
    "/blog/iran-ct-xray-site-readiness-procurement",
  );
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /اول اتاق، بعد دستگاه/);
  assert.match(html, /۱۲ کنترل پیش از امضای سفارش/);
  assert.match(html, /ضخامت ثابت سرب/);
  assert.match(html, /Acceptance، Commissioning و Baseline QC/);
  assert.match(html, /هشت علامت توقف فوری/);
  assert.match(html, /nezamat\.ir\/post-16541/);
  assert.match(html, /nezamat\.ir\/post-16542/);
  assert.match(html, /iaea\.org\/publications\/11102/);
  assert.match(html, /WHO-IAEA-COVID19-tech-specs-for-imaging/);
  assert.match(html, /href="\/procurement"/);
  assert.match(html, /href="\/contact"/);
  assert.match(html, /iran-ct-xray-site-readiness-procurement\.webp/);
  assert.match(html, /تصویر تولیدشده برای Clinoro/);
  assert.match(html, /2026-08-24T08:00:00\+03:30/);
  assert.match(html, /"@type":"Article"/);
  assert.match(
    html,
    /"articleSection":"ایران؛ تصویربرداری، ایمنی پرتوی و خرید"/,
  );
  assert.match(
    html,
    /<meta name="keywords" content="خرید دستگاه CT در ایران,خرید دستگاه رادیولوژی,آمادگی سایت سی تی اسکن/,
  );
  assert.match(
    html,
    /rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/iran-ct-xray-site-readiness-procurement"/,
  );
});

test("daily EU AI Act medical-device procurement article includes SSR, current Omnibus timeline and buyer controls", async () => {
  const response = await request(
    "/blog/eu-ai-act-medical-device-procurement-2026",
  );
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /AI Act عقب افتاد، ریسک خرید نه/);
  assert.match(html, /۲ اوت ۲۰۲۸/);
  assert.match(html, /۲۷ ژوئیه ۲۰۲۶/);
  assert.match(html, /۱۲ مدرک پیش از سفارش و Go-Live/);
  assert.match(html, /هشت علامت توقف فوری/);
  assert.match(html, /AI Omnibus enters into force/);
  assert.match(html, /02024R1689-20260727/);
  assert.match(html, /b78a17d7-e3cd-4943-851d-e02a2f22bbb4_en/);
  assert.match(html, /ai-literacy-questions-answers/);
  assert.match(html, /ai-act\/article-26/);
  assert.match(html, /href="\/procurement"/);
  assert.match(html, /href="\/contact"/);
  assert.match(html, /href="\/blog\/ai-medical-imaging-procurement-checklist"/);
  assert.match(html, /eu-ai-act-medical-device-procurement-2026\.webp/);
  assert.match(html, /تصویر تولیدشده برای Clinoro/);
  assert.match(html, /2026-08-25T08:00:00\+03:30/);
  assert.match(html, /"@type":"Article"/);
  assert.match(
    html,
    /"articleSection":"جهانی؛ هوش مصنوعی، مقررات اروپا و خرید"/,
  );
  assert.match(
    html,
    /<meta name="keywords" content="AI Act تجهیزات پزشکی,خرید تجهیزات پزشکی هوشمند,تجهیزات پزشکی AI اروپا/,
  );
  assert.match(
    html,
    /rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/eu-ai-act-medical-device-procurement-2026"/,
  );
});

test("daily Iran CSSD steam-sterilizer procurement article includes SSR, primary guidance, Tehran metadata and acceptance controls", async () => {
  const response = await request(
    "/blog/iran-cssd-steam-sterilizer-procurement",
  );
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /فقط اتوکلاو نخرید/);
  assert.match(html, /۱۲ کنترل پیش از سفارش و تحویل/);
  assert.match(html, /کالیبراسیون، اعتبارسنجی و پایش روتین/);
  assert.match(html, /پایش مکانیکی، شیمیایی و زیستی/);
  assert.match(html, /هشت علامت توقف فوری/);
  assert.match(html, /iso\.org\/standard\/80271/);
  assert.match(html, /WHO-UHL-IHS-IPC-2022\.4/);
  assert.match(html, /cdc\.gov\/infection-control\/hcp\/disinfection-sterilization\/steam-sterilization/);
  assert.match(html, /treatment\.sbmu\.ac\.ir\/Accreditation-guidelines/);
  assert.match(html, /qavanin\.ir\/Law\/TreeText/);
  assert.match(html, /href="\/blog\/reusable-device-reprocessing"/);
  assert.match(html, /href="\/procurement"/);
  assert.match(html, /href="\/contact"/);
  assert.match(html, /iran-cssd-steam-sterilizer-procurement\.webp/);
  assert.match(html, /تصویر تولیدشده برای Clinoro/);
  assert.match(html, /2026-08-26T08:00:00\+03:30/);
  assert.match(html, /"@type":"Article"/);
  assert.match(
    html,
    /"articleSection":"ایران؛ CSSD، استریلیزاسیون و خرید"/,
  );
  assert.match(
    html,
    /<meta name="keywords" content="خرید اتوکلاو بیمارستانی,استریلایزر بخار CSSD,تجهیز CSSD در ایران/,
  );
  assert.match(
    html,
    /rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/iran-cssd-steam-sterilizer-procurement"/,
  );
});

test("daily global laboratory reagent-rental article includes SSR, authoritative sources, Tehran metadata and contract controls", async () => {
  const response = await request(
    "/blog/laboratory-reagent-rental-procurement-2026",
  );
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /دستگاه رایگان نیست/);
  assert.match(html, /۱۲ بند پیش از امضای قرارداد/);
  assert.match(html, /هزینه هر نتیجه قابل‌گزارش/);
  assert.match(html, /هشت علامت توقف فوری/);
  assert.match(html, /who\.int\/publications\/i\/item\/9789241512558/);
  assert.match(html, /finddx\.org\/20250516_cfp_poc_reader_pvserordt_fv_en/);
  assert.match(html, /fda\.gov\/medical-devices\/device-labeling\/quality-system-regulation-labeling-requirements/);
  assert.match(html, /href="\/blog\/lab-analyzer-acceptance"/);
  assert.match(html, /href="\/procurement"/);
  assert.match(html, /href="\/contact"/);
  assert.match(html, /laboratory-reagent-rental-procurement-2026\.webp/);
  assert.match(html, /تصویر تولیدشده برای Clinoro/);
  assert.match(html, /2026-08-27T08:00:00\+03:30/);
  assert.match(html, /"@type":"Article"/);
  assert.match(
    html,
    /"articleSection":"جهانی؛ آزمایشگاه، IVD و قرارداد خرید"/,
  );
  assert.match(
    html,
    /<meta name="keywords" content="قرارداد Reagent Rental,خرید آنالایزر آزمایشگاهی,هزینه هر تست آزمایشگاهی/,
  );
  assert.match(
    html,
    /rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/laboratory-reagent-rental-procurement-2026"/,
  );
});

test("daily Iran hemodialysis and RO article includes SSR, primary sources, Tehran metadata and acceptance controls", async () => {
  const response = await request(
    "/blog/iran-hemodialysis-ro-water-procurement",
  );
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /آبِ خوب، آپشن نیست/);
  assert.match(html, /۱۲ کنترل پیش از سفارش و Go-Live/);
  assert.match(html, /هفت علامت توقف خرید/);
  assert.match(html, /هزینه چرخه عمر را برای هر جلسه دیالیز/);
  assert.match(html, /goums\.ac\.ir\/content\/66891/);
  assert.match(html, /hkc\.iums\.ac\.ir\/uploads\/283/);
  assert.match(html, /iso\.org\/standard\/84368\.html/);
  assert.match(html, /iso\.org\/standard\/84370\.html/);
  assert.match(html, /cdc\.gov\/dialysis-safety\/hcp\/recommendations-resources\/water-use-in-dialysis/);
  assert.match(html, /qavanin\.ir\/Law\/TreeText/);
  assert.match(html, /href="\/procurement"/);
  assert.match(html, /href="\/contact"/);
  assert.match(html, /iran-hemodialysis-ro-water-procurement\.webp/);
  assert.match(html, /تصویر تولیدشده برای Clinoro/);
  assert.match(html, /2026-08-28T08:00:00\+03:30/);
  assert.match(html, /"@type":"Article"/);
  assert.match(
    html,
    /"articleSection":"ایران؛ همودیالیز، آب پزشکی و خرید"/,
  );
  assert.match(
    html,
    /<meta name="keywords" content="خرید دستگاه دیالیز,RO دیالیز پزشکی,تصفیه آب همودیالیز/,
  );
  assert.match(
    html,
    /rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/iran-hemodialysis-ro-water-procurement"/,
  );
});

test("daily global robot-assisted surgery article includes SSR, current primary sources, Tehran metadata and procurement controls", async () => {
  const response = await request(
    "/blog/robot-assisted-surgery-procurement-2026",
  );
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /ربات جراحی خودش جراحی نمی‌کند/);
  assert.match(html, /۱۲ کنترل پیش از قرارداد/);
  assert.match(html, /هشت علامت توقف/);
  assert.match(html, /هزینه هر کیس را محاسبه کنید/);
  assert.match(html, /fda\.gov\/medical-devices\/surgery-devices\/computer-assisted-surgical-systems/);
  assert.match(html, /nice\.org\.uk\/guidance\/htg742\/chapter\/1-Recommendations/);
  assert.match(html, /england\.nhs\.uk\/long-read\/board-committee-updates/);
  assert.match(html, /who\.int\/publications\/i\/item\/9789240110878/);
  assert.match(html, /surgical-stapler-reload-recall/);
  assert.match(html, /href="\/procurement"/);
  assert.match(html, /href="\/contact"/);
  assert.match(html, /robot-assisted-surgery-procurement-2026\.webp/);
  assert.match(html, /تصویر تولیدشده برای Clinoro/);
  assert.match(html, /2026-08-29T08:00:00\+03:30/);
  assert.match(html, /"@type":"Article"/);
  assert.match(
    html,
    /"articleSection":"جهانی؛ جراحی رباتیک و خرید فناوری"/,
  );
  assert.match(
    html,
    /<meta name="keywords" content="خرید ربات جراحی,جراحی رباتیک,Robot-assisted surgery/,
  );
  assert.match(
    html,
    /rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/robot-assisted-surgery-procurement-2026"/,
  );
});

test("daily Iran ICU ventilator article includes SSR, primary sources, Tehran metadata and acceptance controls", async () => {
  const response = await request(
    "/blog/iran-icu-ventilator-procurement-acceptance",
  );
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /مود بیشتر، ونتیلاتور بهتر نیست/);
  assert.match(html, /۱۲ آزمون پیش از سفارش و Go-Live/);
  assert.match(html, /هشت علامت توقف خرید/);
  assert.match(html, /هزینه هر روز ونتیلاتور آماده/);
  assert.match(html, /iso\.org\/standard\/82707\.html/);
  assert.match(html, /iso\.org\/standard\/87151\.html/);
  assert.match(html, /tech-specs-ventilators-v2-11august20\.docx/);
  assert.match(html, /care-cleaning-and-disinfection-of-respiratory-equipment/);
  assert.match(html, /webstore\.iec\.ch\/en\/publication\/31124/);
  assert.match(html, /qavanin\.ir\/Law\/TreeText/);
  assert.match(html, /href="\/procurement"/);
  assert.match(html, /href="\/contact"/);
  assert.match(html, /iran-icu-ventilator-procurement-acceptance\.webp/);
  assert.match(html, /تصویر تولیدشده برای Clinoro/);
  assert.match(html, /2026-08-30T08:00:00\+03:30/);
  assert.match(html, /"@type":"Article"/);
  assert.match(
    html,
    /"articleSection":"ایران؛ ونتیلاتور ICU و پذیرش فنی"/,
  );
  assert.match(
    html,
    /<meta name="keywords" content="خرید ونتیلاتور ICU,ونتیلاتور بیمارستانی ایران,آزمون پذیرش ونتیلاتور/,
  );
  assert.match(
    html,
    /rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/iran-icu-ventilator-procurement-acceptance"/,
  );
});

test("daily global MRI procurement article includes SSR, current primary guidance, Tehran metadata and acceptance controls", async () => {
  const response = await request(
    "/blog/mri-system-procurement-acceptance-2026",
  );
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /قیمت مگنت، قیمت پروژه نیست/);
  assert.match(html, /۱۲ کنترل پیش از قرارداد و Go-Live/);
  assert.match(html, /هشت علامت توقف خرید/);
  assert.match(html, /هزینه هر اسکن قابل گزارش/);
  assert.match(html, /MHRA_MRI_Guidance_v5-0-02\.pdf/);
  assert.match(html, /webstore\.iec\.ch\/en\/publication\/67211/);
  assert.match(html, /acr\.org\/Clinical-Resources\/Clinical-Tools-and-Reference\/radiology-safety\/mr-safety/);
  assert.match(html, /Changes-to-ACR-Manual-on-MR-Safety\.pdf/);
  assert.match(html, /fda\.gov\/radiation-emitting-products\/mri-magnetic-resonance-imaging\/benefits-and-risks/);
  assert.match(html, /technical-guidelines-for-mri-for-the-surveillance/);
  assert.match(html, /href="\/procurement"/);
  assert.match(html, /href="\/contact"/);
  assert.match(html, /mri-system-procurement-acceptance-2026\.webp/);
  assert.match(html, /تصویر تولیدشده برای Clinoro/);
  assert.match(html, /2026-08-31T08:00:00\+03:30/);
  assert.match(html, /"@type":"Article"/);
  assert.match(
    html,
    /"articleSection":"جهانی؛ MRI، ایمنی و خرید تجهیزات تصویربرداری"/,
  );
  assert.match(
    html,
    /<meta name="keywords" content="خرید دستگاه MRI,آزمون پذیرش MRI,هزینه پروژه MRI/,
  );
  assert.match(
    html,
    /rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/mri-system-procurement-acceptance-2026"/,
  );
});

test("daily alarm-management article includes complete SSR content, international primary sources and licensed local image", async () => {
  const response = await request("/blog/medical-device-alarm-management");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /۱۰ کنترل برای برنامه Alarm Safety/);
  assert.match(html, /چهار خط قرمز/);
  assert.match(html, /href="\/blog\/medical-device-adverse-event-file"/);
  assert.match(html, /psnet\.ahrq\.gov/);
  assert.match(html, /fda\.gov\/files\/medical/);
  assert.match(html, /Managing_medical_devices\.pdf/);
  assert.match(html, /medical-device-alarm-management\.jpg/);
  assert.match(html, /Public Domain/);
  assert.match(html, /"@type":"Article"/);
  assert.match(html, /2026-08-03T08:00:00\+04:00/);
  assert.match(
    html,
    /rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/medical-device-alarm-management"/,
  );
});

test("product detail renders structured data and technical content", async () => {
  const response = await request("/products/ultrasound-imaging-system");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /\"@type\":\"Product\"/);
  assert.match(html, /مشخصات قابل انتخاب/);
  assert.match(html, /PROCUREMENT DECISION PACK/);
  assert.match(html, /بسته تصمیم خرید این گروه محصول/);
  assert.match(html, /PRODUCT INTELLIGENCE/);
  assert.match(html, /سطح شواهد فعلی/);
  assert.match(html, /"@type":"FAQPage"/);
  assert.match(html, /"additionalProperty"/);
  assert.match(html, /درخواست پیشنهاد و دیتاشیت/);
  assert.match(html, /CC BY 4\.0/);
});

test("catalog exposes the buyer Decision Pack and lifecycle cost workspace", async () => {
  const [response, browser, pack] = await Promise.all([
    request("/products"),
    readFile(new URL("../app/products/product-browser.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/products/decision-pack.tsx", import.meta.url), "utf8"),
  ]);
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /مقایسه برای تصمیم خرید/);
  assert.match(browser, /Decision Pack/);
  assert.match(browser, /DecisionPackWorkspace/);
  assert.match(pack, /TOTAL COST OF OWNERSHIP/);
  assert.match(pack, /برآورد برنامه‌ریزی هزینه چرخه عمر/);
  assert.match(pack, /اطلاعات گروه محصول/);
  assert.match(pack, /این محاسبه فقط ابزار برنامه‌ریزی است/);
});

test("English buyer journey renders complete localized server HTML", async () => {
  const localeControl = await readFile(
    new URL("../app/en/document-locale.tsx", import.meta.url),
    "utf8",
  );
  assert.match(localeControl, /root\.lang = "en"/);
  assert.match(localeControl, /root\.dir = "ltr"/);
  const routes = [
    ["/en", /BUYER DECISION SYSTEM/],
    ["/en/products", /Equipment decisions with lifecycle context/],
    ["/en/products/icu-patient-monitor", /PROCUREMENT INTELLIGENCE/],
    ["/en/credentials", /Trust is documented, not implied/],
    ["/en/contact", /Start with the project, not the catalogue/],
    ["/en/privacy", /Information we collect/],
    ["/en/terms", /Equipment information/],
  ];
  for (const [path, expected] of routes) {
    const response = await request(path);
    const html = await response.text();
    assert.equal(response.status, 200, path);
    assert.match(html, expected, path);
    assert.match(html, /lang="en" dir="ltr"/, path);
    assert.match(html, /PRECISION · TRUST · INNOVATION · COMMERCE/, path);
  }
  const response = await request("/en/products/icu-patient-monitor");
  const html = await response.text();
  assert.match(html, /rel="alternate" hrefLang="fa-IR"/);
  assert.match(html, /rel="canonical" href="https:\/\/clinoromedical\.com\/en\/products\/icu-patient-monitor"/);
  assert.match(html, /"inLanguage":"en"/);
  assert.match(html, /Protected and backup power/);
  assert.match(html, /<meta property="og:locale" content="en_US"/);
  assert.match(html, /<meta name="twitter:title" content="ICU Patient Monitor \| Clinoro"/);
  const contactResponse = await request("/en/contact");
  assert.match(await contactResponse.text(), /href="\/en\/privacy"/);
});

test("discovery files expose public routes and protect admin paths", async () => {
  const sitemapResponse = await request("/sitemap.xml");
  const sitemap = await sitemapResponse.text();
  assert.equal(sitemapResponse.status, 200);
  assert.doesNotMatch(sitemap, /<lastmod>(?:09|16):00<\/lastmod>/);
  assert.doesNotMatch(sitemap, /Invalid Date/);
  const blogUrls = [
    ...sitemap.matchAll(
      /<loc>(https:\/\/clinoromedical\.com\/blog\/[^<]+)<\/loc>/g,
    ),
  ].map((match) => match[1]);
  assert.equal(blogUrls.length, 48);
  assert.equal(new Set(blogUrls).size, blogUrls.length);
  assert.match(
    sitemap,
    /https:\/\/clinoromedical\.com\/blog\/eu-medical-device-eifu-procurement-2026/,
  );
  assert.match(
    sitemap,
    /https:\/\/clinoromedical\.com\/blog\/iran-medical-equipment-electrical-site-readiness/,
  );
  assert.match(
    sitemap,
    /https:\/\/clinoromedical\.com\/blog\/medical-device-interoperability-acceptance-2026/,
  );
  assert.match(
    sitemap,
    /https:\/\/clinoromedical\.com\/blog\/home-healthcare-medical-device-procurement-2026/,
  );
  assert.match(
    sitemap,
    /https:\/\/clinoromedical\.com\/blog\/iran-used-refurbished-medical-device-procurement/,
  );
  assert.match(
    sitemap,
    /https:\/\/clinoromedical\.com\/blog\/eu-mdr-legacy-device-procurement-2026/,
  );
  assert.match(
    sitemap,
    /https:\/\/clinoromedical\.com\/blog\/iran-ct-xray-site-readiness-procurement/,
  );
  assert.match(
    sitemap,
    /https:\/\/clinoromedical\.com\/blog\/eu-ai-act-medical-device-procurement-2026/,
  );
  assert.match(
    sitemap,
    /https:\/\/clinoromedical\.com\/blog\/iran-cssd-steam-sterilizer-procurement/,
  );
  assert.match(
    sitemap,
    /https:\/\/clinoromedical\.com\/blog\/laboratory-reagent-rental-procurement-2026/,
  );
  assert.match(
    sitemap,
    /https:\/\/clinoromedical\.com\/blog\/iran-hemodialysis-ro-water-procurement/,
  );
  assert.match(
    sitemap,
    /https:\/\/clinoromedical\.com\/blog\/robot-assisted-surgery-procurement-2026/,
  );
  assert.match(
    sitemap,
    /https:\/\/clinoromedical\.com\/blog\/iran-icu-ventilator-procurement-acceptance/,
  );
  assert.match(
    sitemap,
    /https:\/\/clinoromedical\.com\/blog\/mri-system-procurement-acceptance-2026/,
  );
  assert.match(
    sitemap,
    /https:\/\/clinoromedical\.com\/products\/icu-patient-monitor/,
  );
  assert.match(sitemap, /https:\/\/clinoromedical\.com\/credentials/);
  assert.match(sitemap, /https:\/\/clinoromedical\.com\/en<\/loc>/);
  assert.match(sitemap, /https:\/\/clinoromedical\.com\/en\/products<\/loc>/);
  assert.match(sitemap, /https:\/\/clinoromedical\.com\/en\/products\/icu-patient-monitor/);
  assert.match(sitemap, /https:\/\/clinoromedical\.com\/en\/credentials/);
  assert.match(sitemap, /https:\/\/clinoromedical\.com\/en\/contact/);
  assert.match(sitemap, /https:\/\/clinoromedical\.com\/en\/privacy/);
  assert.match(sitemap, /https:\/\/clinoromedical\.com\/en\/terms/);
  assert.match(sitemap, /https:\/\/clinoromedical\.com\/terms/);
  assert.match(
    sitemap,
    /https:\/\/clinoromedical\.com\/blog\/qmsr-supplier-quality-2026/,
  );
  assert.match(
    sitemap,
    /https:\/\/clinoromedical\.com\/blog\/medical-device-cmms-who-2025/,
  );
  assert.match(
    sitemap,
    /https:\/\/clinoromedical\.com\/blog\/medical-device-shortage-continuity-2026/,
  );
  assert.match(
    sitemap,
    /https:\/\/clinoromedical\.com\/blog\/reusable-device-reprocessing/,
  );
  assert.match(
    sitemap,
    /https:\/\/clinoromedical\.com\/blog\/eudamed-procurement-2026/,
  );
  assert.match(
    sitemap,
    /https:\/\/clinoromedical\.com\/blog\/lab-analyzer-acceptance/,
  );
  assert.match(
    sitemap,
    /https:\/\/clinoromedical\.com\/blog\/servicing-vs-remanufacturing/,
  );
  assert.match(
    sitemap,
    /https:\/\/clinoromedical\.com\/blog\/medical-device-adverse-event-file/,
  );
  assert.match(
    sitemap,
    /https:\/\/clinoromedical\.com\/blog\/iran-medical-device-procurement/,
  );
  assert.match(
    sitemap,
    /https:\/\/clinoromedical\.com\/blog\/ai-device-pccp-procurement/,
  );
  assert.match(
    sitemap,
    /https:\/\/clinoromedical\.com\/blog\/iran-medical-device-calibration/,
  );
  assert.match(
    sitemap,
    /https:\/\/clinoromedical\.com\/blog\/medical-device-decommissioning/,
  );
  assert.match(
    sitemap,
    /https:\/\/clinoromedical\.com\/blog\/iran-hospital-oxygen-concentrator/,
  );
  assert.match(
    sitemap,
    /https:\/\/clinoromedical\.com\/blog\/loan-medical-device-control/,
  );
  assert.match(
    sitemap,
    /https:\/\/clinoromedical\.com\/blog\/iran-medical-device-warehouse/,
  );
  assert.match(
    sitemap,
    /https:\/\/clinoromedical\.com\/blog\/medical-device-alarm-management/,
  );
  assert.match(
    sitemap,
    /https:\/\/clinoromedical\.com\/blog\/iran-medical-device-after-sales-service-contract/,
  );
  const robotsResponse = await request("/robots.txt");
  const robots = await robotsResponse.text();
  assert.equal(robotsResponse.status, 200);
  assert.match(robots, /Disallow: \/admin/);
  assert.match(robots, /Sitemap: https:\/\/clinoromedical\.com\/sitemap\.xml/);
});

test("blog timestamp, canonical, Open Graph and Article JSON-LD share one valid value", async () => {
  const response = await request(
    "/blog/iran-skincare-product-authenticity-check",
  );
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(
    html,
    /rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/iran-skincare-product-authenticity-check"/,
  );
  assert.equal(
    (html.match(/2026-08-04T09:00:00\+04:00/g) ?? []).length >= 2,
    true,
  );
  assert.match(html, /"datePublished":"2026-08-04T09:00:00\+04:00"/);
});

test("terms page is public and canonical", async () => {
  const response = await request("/terms");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /شرایط استفاده/);
  assert.match(
    html,
    /rel="canonical" href="https:\/\/clinoromedical\.com\/terms"/,
  );
});
