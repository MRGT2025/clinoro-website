import assert from "node:assert/strict";
import test from "node:test";
import {readFile} from "node:fs/promises";

const workerUrl=new URL("../dist/server/index.js",import.meta.url);
workerUrl.searchParams.set("test",`${process.pid}-${Date.now()}`);
const {default:worker}=await import(workerUrl.href);
const env={ASSETS:{fetch:async()=>new Response("Not found",{status:404})}};
const context={waitUntil(){},passThroughOnException(){}};
const request=(path)=>worker.fetch(new Request(`http://localhost${path}`,{headers:{accept:"text/html"}}),env,context);

test("RFQ endpoint validates and stores a real submission",async()=>{
  const inserts=[];
  const db={
    prepare(sql){const statement={args:[],bind(...args){this.args=args;return this},async first(){return sql.startsWith("SELECT COUNT")?{total:0}:null},async run(){if(sql.startsWith("INSERT INTO rfq_submissions"))inserts.push({sql,args:this.args});return{meta:{changes:1}}},async all(){return{results:[]}}};return statement},
    async batch(){return[]},
  };
  const response=await worker.fetch(new Request("http://localhost/api/rfq",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({name:"کاربر آزمایشی",organization:"مرکز تست",phone:"+98 913 000 0000",email:"test@example.com",topic:"استعلام محصول",productSlug:"icu-patient-monitor",city:"اصفهان",quantity:"2",timeline:"۱ تا ۳ ماه",message:"درخواست آزمایشی معتبر برای بررسی فنی محصول",consent:true,website:"",sourceUrl:"http://localhost/contact"})}),{...env,DB:db},context);
  const result=await response.json();
  assert.equal(response.status,201);
  assert.match(result.reference,/^CLN-\d{6}-[A-F0-9]{6}$/);
  assert.equal(inserts.length,1);
  assert.equal(inserts[0].args[4],"کاربر آزمایشی");
});

test("home exposes production SEO and security metadata",async()=>{
  const response=await request("/");const html=await response.text();
  assert.equal(response.status,200);
  assert.match(response.headers.get("content-type")??"",/^text\/html\b/i);
  assert.equal(response.headers.get("x-content-type-options"),"nosniff");
  assert.equal(response.headers.get("x-frame-options"),"SAMEORIGIN");
  assert.match(response.headers.get("content-security-policy")??"",/frame-ancestors 'self'/);
  assert.doesNotMatch(html,/codex-preview/);
  assert.match(html,/application\/ld\+json/);
  assert.match(html,/Organization/);
  assert.match(html,/rel="canonical" href="https:\/\/clinoromedical\.com\/"/);
  assert.match(html,/clinoro-hero-prism\.webp/);
});

test("catalog links to real product detail pages",async()=>{
  const response=await request("/products");const html=await response.text();
  assert.equal(response.status,200);
  assert.match(html,/\/products\/icu-patient-monitor/);
  assert.match(html,/patient-monitor\.jpg/);
  assert.match(html,/تصویر مرجع/);
});

test("blog posts are present in initial HTML without client-side filtering",async()=>{
  const response=await request("/blog");const html=await response.text();
  assert.equal(response.status,200);
  assert.equal((html.match(/<article class="blog-card/g)??[]).length,13);
  assert.match(html,/کمبود تجهیزات پزشکی در ۲۰۲۶/);
  assert.match(html,/خرید تجهیز چندبارمصرف بدون برنامه بازفرآوری/);
  assert.match(html,/QMSR از ۲۰۲۶ اجرایی شد/);
  assert.match(html,/از اکسل تا CMMS/);
  assert.match(html,/ثبت تجهیزات پزشکی در بریتانیای کبیر/);
  assert.match(html,/WHO Listed Authorities برای تجهیزات پزشکی/);
  assert.doesNotMatch(html,/aria-live="polite"/);
  assert.doesNotMatch(html,/هنوز مطلبی منتشر نشده است/);
});

test("all reveal content stays visible without JavaScript or an observer",async()=>{
  const css=await readFile(new URL("../app/globals.css",import.meta.url),"utf8");
  const experience=await readFile(new URL("../app/experience.tsx",import.meta.url),"utf8");
  assert.match(css,/\.motion-ready \.motion-section,\.motion-ready \[data-reveal\]\{opacity:1;visibility:visible;transform:none;filter:none;scale:1/);
  assert.doesNotMatch(css,/\.motion-ready \.motion-section,\.motion-ready \[data-reveal\]\{[^}]*opacity:0/);
  assert.doesNotMatch(experience,/IntersectionObserver/);
});

test("new Clinoro V35 article renders complete server HTML",async()=>{
  const response=await request("/blog/mhra-device-registration-2026");const html=await response.text();
  assert.equal(response.status,200);
  assert.match(html,/تفاوت «عرضه به بازار» و «به‌خدمت‌گیری»/);
  assert.match(html,/چک‌لیست عملی برای پرونده تأمین/);
  assert.match(html,/راهنمای ثبت تجهیزات پزشکی MHRA/);
});

test("daily QMSR article includes complete SSR content, SEO and licensed local image",async()=>{
  const response=await request("/blog/qmsr-supplier-quality-2026");const html=await response.text();
  assert.equal(response.status,200);
  assert.match(html,/۱۲ مدرکی که باید در ارزیابی بررسی شوند/);
  assert.match(html,/توافق کیفیت را از قرارداد تجاری جدا نکنید/);
  assert.match(html,/href="\/procurement"/);
  assert.match(html,/qmsr-quality-system-2026\.jpg/);
  assert.match(html,/CC BY 2\.0/);
  assert.match(html,/\"@type\":\"Article\"/);
  assert.match(html,/2026-07-27T08:05:00\+04:00/);
  assert.match(html,/rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/qmsr-supplier-quality-2026"/);
});

test("daily WHO CMMS article includes complete SSR content, SEO and licensed local image",async()=>{
  const response=await request("/blog/medical-device-cmms-who-2025");const html=await response.text();
  assert.equal(response.status,200);
  assert.match(html,/شناسنامه حداقلی هر تجهیز/);
  assert.match(html,/برنامه عملی برای شروع/);
  assert.match(html,/href="\/blog\/medical-equipment-total-cost-of-ownership"/);
  assert.match(html,/medical-device-cmms-who-2025\.jpg/);
  assert.match(html,/Public Domain/);
  assert.match(html,/\"@type\":\"Article\"/);
  assert.match(html,/rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/medical-device-cmms-who-2025"/);
});

test("daily supply resilience article includes complete SSR content, current sources and local image",async()=>{
  const response=await request("/blog/medical-device-shortage-continuity-2026");const html=await response.text();
  assert.equal(response.status,200);
  assert.match(html,/هشت داده‌ای که هر قلم بحرانی باید داشته باشد/);
  assert.match(html,/سناریوی ۳۰، ۶۰ و ۹۰ روزه/);
  assert.match(html,/href="\/procurement"/);
  assert.match(html,/medical-device-supply-resilience-2026\.jpg/);
  assert.match(html,/Public Domain/);
  assert.match(html,/\"@type\":\"Article\"/);
  assert.match(html,/2026-07-28T08:01:00\+04:00/);
  assert.match(html,/rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/medical-device-shortage-continuity-2026"/);
});

test("daily reusable-device article includes complete SSR content, SEO and licensed local image",async()=>{
  const response=await request("/blog/reusable-device-reprocessing");const html=await response.text();
  assert.equal(response.status,200);
  assert.match(html,/۱۴ سؤال پیش از امضای قرارداد/);
  assert.match(html,/ظرفیت واقعی CSSD را محاسبه کنید/);
  assert.match(html,/href="\/products\/medical-autoclave"/);
  assert.match(html,/reusable-device-reprocessing\.jpg/);
  assert.match(html,/Public Domain/);
  assert.match(html,/\"@type\":\"Article\"/);
  assert.match(html,/2026-07-28T08:01:00\+04:00/);
  assert.match(html,/rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/reusable-device-reprocessing"/);
});

test("product detail renders structured data and technical content",async()=>{
  const response=await request("/products/ultrasound-imaging-system");const html=await response.text();
  assert.equal(response.status,200);
  assert.match(html,/\"@type\":\"Product\"/);
  assert.match(html,/مشخصات قابل انتخاب/);
  assert.match(html,/درخواست پیشنهاد و دیتاشیت/);
  assert.match(html,/CC BY 4\.0/);
});

test("discovery files expose public routes and protect admin paths",async()=>{
  const sitemapResponse=await request("/sitemap.xml");const sitemap=await sitemapResponse.text();
  assert.equal(sitemapResponse.status,200);
  assert.match(sitemap,/https:\/\/clinoromedical\.com\/products\/icu-patient-monitor/);
  assert.match(sitemap,/https:\/\/clinoromedical\.com\/credentials/);
  assert.match(sitemap,/https:\/\/clinoromedical\.com\/blog\/qmsr-supplier-quality-2026/);
  assert.match(sitemap,/https:\/\/clinoromedical\.com\/blog\/medical-device-cmms-who-2025/);
  assert.match(sitemap,/https:\/\/clinoromedical\.com\/blog\/medical-device-shortage-continuity-2026/);
  assert.match(sitemap,/https:\/\/clinoromedical\.com\/blog\/reusable-device-reprocessing/);
  const robotsResponse=await request("/robots.txt");const robots=await robotsResponse.text();
  assert.equal(robotsResponse.status,200);
  assert.match(robots,/Disallow: \/admin/);
  assert.match(robots,/Sitemap: https:\/\/clinoromedical\.com\/sitemap\.xml/);
});
