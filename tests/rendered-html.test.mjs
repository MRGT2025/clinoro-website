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
  assert.match(html,/clinoro-logo-primary\.png/);
  assert.match(html,/clinoro-mark-primary\.png/);
  assert.match(html,/لوگوی Clinoro با نشانه پالس پزشکی و درگاه تجارت/);
  assert.match(html,/clinoro-wordmark-primary\.png/);
  assert.match(html,/class="brand-intro"/);
  assert.match(html,/PRECISION/);
  assert.match(html,/MEDICAL TECHNOLOGY/);
  assert.match(html,/COMMERCE/);
  assert.doesNotMatch(html,/clinoro-logo-minimal-grey\.png/);
});

test("manifest and document icons use the final Clinoro app mark",async()=>{
  const response=await request("/manifest.webmanifest");const manifest=await response.json();
  assert.equal(response.status,200);
  assert.equal(manifest.theme_color,"#081f3a");
  assert.equal(manifest.icons[0].src,"/assets/clinoro-app-icon.png");
  assert.match(manifest.icons[0].purpose,/maskable/);
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
  assert.equal((html.match(/<article class="blog-card/g)??[]).length,34);
  assert.match(html,/خدمات پس از فروش تجهیزات پزشکی در ایران؛ ۱۲ بند قرارداد/);
  assert.match(html,/انبار تجهیزات پزشکی در ایران؛ ۱۲ کنترل/);
  assert.match(html,/هر صدایی هشدار حیاتی نیست؛ ۱۰ کنترل/);
  assert.match(html,/اکسیژن‌ساز بیمارستانی در ایران؛ ۱۲ کنترل/);
  assert.match(html,/تجهیز پزشکی امانی وارد اتاق عمل می‌شود/);
  assert.match(html,/کالیبراسیون تجهیزات پزشکی در ایران؛ ۹ کنترل/);
  assert.match(html,/تجهیز پزشکی را چه زمانی از رده خارج کنیم؟/);
  assert.match(html,/خرید تجهیزات پزشکی در ایران؛ ۱۰ مدرک/);
  assert.match(html,/دستگاه پزشکی مبتنی بر AI بعداً تغییر می‌کند/);
  assert.match(html,/تعمیر یا بازساخت؟ ۱۱ بند حیاتی/);
  assert.match(html,/خرابی تجهیز را فقط تعمیر نکنید/);
  assert.match(html,/EUDAMED از مه ۲۰۲۶ اجباری شد/);
  assert.match(html,/آنالایزر آزمایشگاهی را تحویل گرفتید/);
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
  const intro=await readFile(new URL("../app/brand-intro.tsx",import.meta.url),"utf8");
  assert.match(css,/\.motion-ready \.motion-section,\.motion-ready \[data-reveal\]\{opacity:1;visibility:visible;transform:none;filter:none;scale:1/);
  assert.doesNotMatch(css,/\.motion-ready \.motion-section,\.motion-ready \[data-reveal\]\{[^}]*opacity:0/);
  assert.doesNotMatch(experience,/IntersectionObserver/);
  assert.match(intro,/sessionStorage\.setItem\(INTRO_KEY,"seen"\)/);
  assert.match(intro,/prefers-reduced-motion: reduce/);
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

test("daily EUDAMED article includes complete SSR content, SEO and licensed local image",async()=>{
  const response=await request("/blog/eudamed-procurement-2026");const html=await response.text();
  assert.equal(response.status,200);
  assert.match(html,/۱۰ کنترل پیش از قرارداد/);
  assert.match(html,/یک ماتریس ساده برای پرونده تأمین/);
  assert.match(html,/href="\/procurement"/);
  assert.match(html,/eudamed-procurement-2026\.jpg/);
  assert.match(html,/Public Domain/);
  assert.match(html,/\"@type\":\"Article\"/);
  assert.match(html,/2026-07-29T07:59:00\+04:00/);
  assert.match(html,/rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/eudamed-procurement-2026"/);
});

test("daily laboratory acceptance article includes complete SSR content, SEO and licensed local image",async()=>{
  const response=await request("/blog/lab-analyzer-acceptance");const html=await response.text();
  assert.equal(response.status,200);
  assert.match(html,/۱۲ آزمون و کنترل پیش از Go-Live/);
  assert.match(html,/معیار قبولی را قبل از نتیجه بنویسید/);
  assert.match(html,/href="\/products\/hematology-analyzer"/);
  assert.match(html,/lab-analyzer-acceptance\.jpg/);
  assert.match(html,/Public Domain/);
  assert.match(html,/\"@type\":\"Article\"/);
  assert.match(html,/2026-07-29T07:59:00\+04:00/);
  assert.match(html,/rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/lab-analyzer-acceptance"/);
});

test("daily servicing article includes complete SSR content, SEO and licensed local image",async()=>{
  const response=await request("/blog/servicing-vs-remanufacturing");const html=await response.text();
  assert.equal(response.status,200);
  assert.match(html,/۱۱ بند حیاتی در قرارداد سرویس/);
  assert.match(html,/آزمون شش‌سؤالی پیش از صدور سفارش کار/);
  assert.match(html,/href="\/blog\/connected-medical-device-cybersecurity-checklist-2026"/);
  assert.match(html,/servicing-vs-remanufacturing\.jpg/);
  assert.match(html,/Public Domain/);
  assert.match(html,/\"@type\":\"Article\"/);
  assert.match(html,/2026-07-30T08:01:00\+04:00/);
  assert.match(html,/rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/servicing-vs-remanufacturing"/);
});

test("daily adverse-event article includes complete SSR content, SEO and licensed local image",async()=>{
  const response=await request("/blog/medical-device-adverse-event-file");const html=await response.text();
  assert.equal(response.status,200);
  assert.match(html,/۱۲ داده‌ای که پرونده باید داشته باشد/);
  assert.match(html,/یک گردش‌کار پنج‌مرحله‌ای/);
  assert.match(html,/href="\/blog\/medical-device-cmms-who-2025"/);
  assert.match(html,/medical-device-adverse-event-file\.jpg/);
  assert.match(html,/Public Domain/);
  assert.match(html,/\"@type\":\"Article\"/);
  assert.match(html,/2026-07-30T08:01:00\+04:00/);
  assert.match(html,/rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/medical-device-adverse-event-file"/);
});

test("daily Iran procurement article includes complete SSR content, Iranian primary sources and licensed local image",async()=>{
  const response=await request("/blog/iran-medical-device-procurement");const html=await response.text();
  assert.equal(response.status,200);
  assert.match(html,/۱۰ مدرک پیش از پرداخت و تحویل/);
  assert.match(html,/سه نقطه توقف در فرآیند خرید/);
  assert.match(html,/href="\/procurement"/);
  assert.match(html,/qavanin\.ir\/Law\/TreeText/);
  assert.match(html,/fdo\.tums\.ac\.ir/);
  assert.match(html,/iran-medical-device-procurement\.jpg/);
  assert.match(html,/Public Domain/);
  assert.match(html,/"@type":"Article"/);
  assert.match(html,/2026-07-31T08:01:00\+04:00/);
  assert.match(html,/rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/iran-medical-device-procurement"/);
});

test("daily AI PCCP article includes complete SSR content, international primary sources and licensed local image",async()=>{
  const response=await request("/blog/ai-device-pccp-procurement");const html=await response.text();
  assert.equal(response.status,200);
  assert.match(html,/۹ سؤال پیش از امضای قرارداد/);
  assert.match(html,/پیوست تغییر نرم‌افزار در قرارداد/);
  assert.match(html,/href="\/blog\/ai-medical-imaging-procurement-checklist"/);
  assert.match(html,/predetermined-change-control-plan-artificial-intelligence/);
  assert.match(html,/ai-device-pccp-procurement\.jpg/);
  assert.match(html,/Public Domain/);
  assert.match(html,/"@type":"Article"/);
  assert.match(html,/2026-07-31T08:01:00\+04:00/);
  assert.match(html,/rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/ai-device-pccp-procurement"/);
});

test("daily Iran calibration article includes complete SSR content, Iranian official sources and licensed local image",async()=>{
  const response=await request("/blog/iran-medical-device-calibration");const html=await response.text();
  assert.equal(response.status,200);
  assert.match(html,/۹ کنترل برای یک برنامه قابل‌دفاع/);
  assert.match(html,/حداقل اقلام گزارش تحویلی/);
  assert.match(html,/href="\/blog\/medical-device-cmms-who-2025"/);
  assert.match(html,/qavanin\.ir\/Law\/TreeText/);
  assert.match(html,/sthn\.tums\.ac\.ir/);
  assert.match(html,/vc-food-drug\.kums\.ac\.ir/);
  assert.match(html,/iran-medical-device-calibration\.jpg/);
  assert.match(html,/Public Domain/);
  assert.match(html,/"@type":"Article"/);
  assert.match(html,/2026-08-01T08:00:00\+04:00/);
  assert.match(html,/rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/iran-medical-device-calibration"/);
});

test("daily decommissioning article includes complete SSR content, international primary sources and licensed local image",async()=>{
  const response=await request("/blog/medical-device-decommissioning");const html=await response.text();
  assert.equal(response.status,200);
  assert.match(html,/۱۰ گام برای خروج ایمن و قابل‌پیگیری/);
  assert.match(html,/چهار خط قرمز/);
  assert.match(html,/href="\/blog\/connected-medical-device-cybersecurity-checklist-2026"/);
  assert.match(html,/who\.int\/publications\/i\/item\/9789241517041/);
  assert.match(html,/Managing_medical_devices\.pdf/);
  assert.match(html,/medical-device-decommissioning\.jpg/);
  assert.match(html,/Public Domain/);
  assert.match(html,/"@type":"Article"/);
  assert.match(html,/2026-08-01T08:00:00\+04:00/);
  assert.match(html,/rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/medical-device-decommissioning"/);
});

test("daily Iran oxygen-concentrator article includes complete SSR content, Iranian official sources and licensed local image",async()=>{
  const response=await request("/blog/iran-hospital-oxygen-concentrator");const html=await response.text();
  assert.equal(response.status,200);
  assert.match(html,/۱۲ کنترل برای بهره‌برداری قابل‌دفاع/);
  assert.match(html,/سه سطح اقدام برای نتیجه نامطلوب/);
  assert.match(html,/href="\/blog\/medical-device-cmms-who-2025"/);
  assert.match(html,/ta\.mui\.ac\.ir/);
  assert.match(html,/qavanin\.ir\/Law\/TreeText/);
  assert.match(html,/iran-hospital-oxygen-concentrator\.jpg/);
  assert.match(html,/Public Domain/);
  assert.match(html,/"@type":"Article"/);
  assert.match(html,/2026-08-02T08:00:00\+04:00/);
  assert.match(html,/rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/iran-hospital-oxygen-concentrator"/);
});

test("daily loan-medical-device article includes complete SSR content, current international sources and licensed local image",async()=>{
  const response=await request("/blog/loan-medical-device-control");const html=await response.text();
  assert.equal(response.status,200);
  assert.match(html,/۱۲ کنترل پیش از ورود به چرخه بالینی/);
  assert.match(html,/چه زمانی دستگاه امانی را نپذیریم؟/);
  assert.match(html,/href="\/blog\/medical-equipment-total-cost-of-ownership"/);
  assert.match(html,/shtm-01-08-v1-sept-2025\.pdf/);
  assert.match(html,/Managing_medical_devices\.pdf/);
  assert.match(html,/loan-medical-device-control\.jpg/);
  assert.match(html,/Public Domain/);
  assert.match(html,/"@type":"Article"/);
  assert.match(html,/2026-08-02T08:00:00\+04:00/);
  assert.match(html,/rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/loan-medical-device-control"/);
});

test("daily Iran warehouse article includes complete SSR content, Iranian official sources and licensed local image",async()=>{
  const response=await request("/blog/iran-medical-device-warehouse");const html=await response.text();
  assert.equal(response.status,200);
  assert.match(html,/۱۲ کنترل برای یک انبار قابل‌دفاع/);
  assert.match(html,/پنج شاخص برای جلسه ماهانه/);
  assert.match(html,/href="\/blog\/medical-device-recall-readiness"/);
  assert.match(html,/fdo\.mui\.ac\.ir/);
  assert.match(html,/fdo\.tums\.ac\.ir/);
  assert.match(html,/md\.bpums\.ac\.ir/);
  assert.match(html,/iran-medical-device-warehouse\.jpg/);
  assert.match(html,/Public Domain/);
  assert.match(html,/"@type":"Article"/);
  assert.match(html,/2026-08-03T08:00:00\+04:00/);
  assert.match(html,/rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/iran-medical-device-warehouse"/);
});

test("daily Iran after-sales contract article includes complete SSR, Tehran timestamp and SEO metadata",async()=>{
  const response=await request("/blog/iran-medical-device-after-sales-service-contract");const html=await response.text();
  assert.equal(response.status,200);
  assert.match(html,/۱۲ بند حیاتی قرارداد خدمات پس از فروش/);
  assert.match(html,/ماتریس امتیازدهی که قیمت را از تصمیم جدا نمی‌کند/);
  assert.match(html,/href="\/procurement"/);
  assert.match(html,/href="\/contact"/);
  assert.match(html,/qavanin\.ir\/Law\/TreeText/);
  assert.match(html,/dotic\.ir\/news\/2293/);
  assert.match(html,/iran-medical-device-after-sales-service-contract\.webp/);
  assert.match(html,/تصویر تولیدشده برای Clinoro/);
  assert.match(html,/"@type":"Article"/);
  assert.match(html,/"articleSection":"ایران؛ خرید و خدمات"/);
  assert.match(html,/<meta name="keywords" content="خدمات پس از فروش تجهیزات پزشکی,قرارداد تجهیزات پزشکی/);
  assert.match(html,/خدمات پس از فروش تجهیزات پزشکی, قرارداد تجهیزات پزشکی/);
  assert.match(html,/2026-08-14T08:00:00\+03:30/);
  assert.match(html,/rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/iran-medical-device-after-sales-service-contract"/);
});

test("daily alarm-management article includes complete SSR content, international primary sources and licensed local image",async()=>{
  const response=await request("/blog/medical-device-alarm-management");const html=await response.text();
  assert.equal(response.status,200);
  assert.match(html,/۱۰ کنترل برای برنامه Alarm Safety/);
  assert.match(html,/چهار خط قرمز/);
  assert.match(html,/href="\/blog\/medical-device-adverse-event-file"/);
  assert.match(html,/psnet\.ahrq\.gov/);
  assert.match(html,/fda\.gov\/files\/medical/);
  assert.match(html,/Managing_medical_devices\.pdf/);
  assert.match(html,/medical-device-alarm-management\.jpg/);
  assert.match(html,/Public Domain/);
  assert.match(html,/"@type":"Article"/);
  assert.match(html,/2026-08-03T08:00:00\+04:00/);
  assert.match(html,/rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/medical-device-alarm-management"/);
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
  assert.doesNotMatch(sitemap,/<lastmod>(?:09|16):00<\/lastmod>/);
  assert.doesNotMatch(sitemap,/Invalid Date/);
  const blogUrls=[...sitemap.matchAll(/<loc>(https:\/\/clinoromedical\.com\/blog\/[^<]+)<\/loc>/g)].map(match=>match[1]);
  assert.equal(blogUrls.length,34);
  assert.equal(new Set(blogUrls).size,blogUrls.length);
  assert.match(sitemap,/https:\/\/clinoromedical\.com\/products\/icu-patient-monitor/);
  assert.match(sitemap,/https:\/\/clinoromedical\.com\/credentials/);
  assert.match(sitemap,/https:\/\/clinoromedical\.com\/terms/);
  assert.match(sitemap,/https:\/\/clinoromedical\.com\/blog\/qmsr-supplier-quality-2026/);
  assert.match(sitemap,/https:\/\/clinoromedical\.com\/blog\/medical-device-cmms-who-2025/);
  assert.match(sitemap,/https:\/\/clinoromedical\.com\/blog\/medical-device-shortage-continuity-2026/);
  assert.match(sitemap,/https:\/\/clinoromedical\.com\/blog\/reusable-device-reprocessing/);
  assert.match(sitemap,/https:\/\/clinoromedical\.com\/blog\/eudamed-procurement-2026/);
  assert.match(sitemap,/https:\/\/clinoromedical\.com\/blog\/lab-analyzer-acceptance/);
  assert.match(sitemap,/https:\/\/clinoromedical\.com\/blog\/servicing-vs-remanufacturing/);
  assert.match(sitemap,/https:\/\/clinoromedical\.com\/blog\/medical-device-adverse-event-file/);
  assert.match(sitemap,/https:\/\/clinoromedical\.com\/blog\/iran-medical-device-procurement/);
  assert.match(sitemap,/https:\/\/clinoromedical\.com\/blog\/ai-device-pccp-procurement/);
  assert.match(sitemap,/https:\/\/clinoromedical\.com\/blog\/iran-medical-device-calibration/);
  assert.match(sitemap,/https:\/\/clinoromedical\.com\/blog\/medical-device-decommissioning/);
  assert.match(sitemap,/https:\/\/clinoromedical\.com\/blog\/iran-hospital-oxygen-concentrator/);
  assert.match(sitemap,/https:\/\/clinoromedical\.com\/blog\/loan-medical-device-control/);
  assert.match(sitemap,/https:\/\/clinoromedical\.com\/blog\/iran-medical-device-warehouse/);
  assert.match(sitemap,/https:\/\/clinoromedical\.com\/blog\/medical-device-alarm-management/);
  assert.match(sitemap,/https:\/\/clinoromedical\.com\/blog\/iran-medical-device-after-sales-service-contract/);
  const robotsResponse=await request("/robots.txt");const robots=await robotsResponse.text();
  assert.equal(robotsResponse.status,200);
  assert.match(robots,/Disallow: \/admin/);
  assert.match(robots,/Sitemap: https:\/\/clinoromedical\.com\/sitemap\.xml/);
});

test("blog timestamp, canonical, Open Graph and Article JSON-LD share one valid value",async()=>{
  const response=await request("/blog/iran-skincare-product-authenticity-check");const html=await response.text();
  assert.equal(response.status,200);
  assert.match(html,/rel="canonical" href="https:\/\/clinoromedical\.com\/blog\/iran-skincare-product-authenticity-check"/);
  assert.equal((html.match(/2026-08-04T09:00:00\+04:00/g)??[]).length>=2,true);
  assert.match(html,/"datePublished":"2026-08-04T09:00:00\+04:00"/);
});

test("terms page is public and canonical",async()=>{
  const response=await request("/terms");const html=await response.text();
  assert.equal(response.status,200);
  assert.match(html,/شرایط استفاده/);
  assert.match(html,/rel="canonical" href="https:\/\/clinoromedical\.com\/terms"/);
});
