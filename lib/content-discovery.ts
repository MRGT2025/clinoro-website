import { normalizeBlogSearch } from "./blog-search.mjs";
import { getPublishedBlogPosts } from "./blog";
import { productMatchesCategory, type ProductCategory, type CatalogProductInput } from "./catalog";
import type { BlogPost } from "./site-content";

const generic = new Set(["خرید","تجهیزات","پزشکی","ایران","جهانی","تحویل","دستگاه","راهنمای","راهنما","برای","پذیرش","فنی","تامین","تجهیز","مطالعه","خدمات","شرط","معیار","از","تا","با","در","و","را","به","قابل","است","پیش","بررسی","نصب","نگهداری","های","ها","کلینورو","clinoro"]);
const domains = [/چشم|تونومتر|پریمت|شبکیه|فیکو|ویترکتوم|ophthalm|perimetr|tonomet|oct\b/i, /سونوگراف|ultrasound|پروب/i, /آزمایشگاه|آنالایزر|هماتولوژی|بیوشیمی|laboratory|analyzer/i, /استریل|cssd|اتوکلاو|steriliz/i, /دندان|لایت.?کیور|dental/i];
function domainMatch(query: string, candidate: string) {
  return domains.some(pattern => pattern.test(query) && pattern.test(candidate));
}
function tokens(text: string) {
  return new Set(normalizeBlogSearch(text).split(" ").filter(word => word.length > 2 && !generic.has(word) && !/^\d+$/.test(word)));
}
type IndexedPost = { post: BlogPost & {publishedTime: string}; title: Set<string>; context: Set<string>; domainText: string; timestamp: number };
// Content documents are immutable snapshots. A new CMS document gets a new
// array, so its index is rebuilt without retaining old documents indefinitely.
const relatedIndex = new WeakMap<BlogPost[], IndexedPost[]>();
function indexPosts(posts: BlogPost[]) {
  const cached = relatedIndex.get(posts);
  if (cached) return cached;
  const index = getPublishedBlogPosts(posts).map(post => ({
    post, title: tokens(post.title),
    context: tokens([post.category, ...(post.keywords || [])].join(" ")),
    domainText: post.title + " " + post.category,
    timestamp: Date.parse(post.publishedTime),
  }));
  relatedIndex.set(posts, index);
  return index;
}
export function relatedBlogPosts(posts: BlogPost[], subject: string, excludeSlug = "", limit = 3) {
  const query = [...tokens(subject)];
  return indexPosts(posts)
    .filter(({post}) => post.slug !== excludeSlug)
    .map(({post, title, context, domainText, timestamp}) => {
      const domain = domainMatch(subject, domainText) ? 8 : 0;
      const score = domain + query.reduce((sum, token) => sum + (title.has(token) ? 3 : context.has(token) ? 1 : 0), 0);
      return { post, score, timestamp };
    })
    .filter(item => item.score >= 3)
    .sort((a,b) => b.score - a.score || b.timestamp - a.timestamp)
    .slice(0,limit).map(item => item.post);
}
export function categoryHasProducts(category: ProductCategory, categories: ProductCategory[], products: CatalogProductInput[]) {
  return products.some(product => product.slug?.trim() && productMatchesCategory(product,categories,category.id));
}
export function homeCategoryPath(title: string, english: string, categories: ProductCategory[]) {
  const aliases: Record<string,string> = {"critical care":"critical","imaging systems":"imaging","laboratory":"lab","operating room":"surgery","sterile processing":"sterile","care delivery":"infusion"};
  const normalized = normalizeBlogSearch(english);
  const found = categories.find(category => !category.parentId && normalizeBlogSearch(category.fa) === normalizeBlogSearch(title))
    || categories.find(category => category.id === aliases[normalized]);
  return found ? `/products/category/${found.id}` : "/products";
}

const categoryQuestions: Record<string,string[]> = {
  critical: ["محل استفاده، گروه بیمار و نیاز به اتصال مانیتورینگ مرکزی را مشخص کنید.", "سازگاری سنسور، کاف و کابل را برای مدل دقیق پیشنهادی بررسی کنید.", "هشدارها، برق پشتیبان، آموزش و زمان رفع خرابی را در صورت‌جلسهٔ تحویل بیاورید."],
  imaging: ["تخصص، نوع مطالعه و ترکیب پروب یا تجهیزات جانبی موردنیاز را بنویسید.", "کیفیت تصویر و خروجی داده را روی سناریوی موردنیاز مرکز و مقصد واقعی بررسی کنید.", "آماده‌سازی محل، هزینهٔ نرم‌افزار و قطعات اصلی را جدا از قیمت پایه مقایسه کنید."],
  lab: ["حجم نمونه، فهرست آزمایش‌ها و ظرفیت واقعی ساعات کاری را تعریف کنید.", "هزینه و شرایط تأمین معرف، کالیبراتور و کنترل را همراه دستگاه بسنجید.", "آزمون‌های تأیید عملکرد و اتصال به LIS را پیش از شروع گزارش‌دهی توافق کنید."],
  surgery: ["فهرست اعمال، فضای اتاق و تجهیزات جانبی لازم را مشخص کنید.", "نیازهای برق، گاز، نصب و سازگاری اجزا را در بازدید محل بررسی کنید.", "معیار پذیرش، آموزش تیم، برنامه سرویس و تداوم خدمت هنگام خرابی را مکتوب کنید."],
  sterile: ["نوع بار، ظرفیت موردنیاز و گردش ابزار آلوده و تمیز را تعیین کنید.", "سازگاری چرخه، بسته‌بندی و ابزار را طبق دستورالعمل‌های همان تجهیزات بررسی کنید.", "پیش‌نیاز آب و برق، آزمون تحویل و مدارک ردیابی هر چرخه را از پیش مشخص کنید."],
  aesthetics: ["کاربرد حرفه‌ای و هویت دقیق محصول یا دستگاه را در درخواست استعلام بنویسید.", "مدارک سازنده، دامنهٔ ثبت و شرایط نگهداری اقلام پیشنهادی را بررسی کنید.", "برای اقلام مصرفی، سری ساخت و انقضا؛ و برای دستگاه، آموزش و خدمات را روشن کنید."],
};
export function categoryBuyingQuestions(category: ProductCategory) {
  return categoryQuestions[category.id] || categoryQuestions[category.parentId] || [
    "نام دقیق محصول، کاربرد و مقدار موردنیاز را در استعلام بنویسید.",
    "مشخصات، مدارک سازنده و شرایط تحویل را برای همان قلم پیشنهادی بررسی کنید.",
    "هزینهٔ کامل، اقلام همراه و مسئول پاسخ‌گویی پس از تحویل را مکتوب کنید.",
  ];
}
