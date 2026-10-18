/** @typedef {{title:string, excerpt:string, category:string, slug:string}} SearchPost */

export const blogTopics = [
  { id: "all", label: "همه موضوع‌ها", terms: [] },
  { id: "imaging", label: "تصویربرداری و تشخیص", terms: ["تصویربرداری", "mri", "ct", "سونوگرافی", "پرتو", "dxa", "emg", "eeg", "ecg"] },
  { id: "surgery", label: "اتاق عمل و جراحی", terms: ["جراحی", "اتاق عمل", "آندوسکوپی", "اندوسکوپی", "لاپاراسکوپی", "فیکو", "ویترکتومی", "پندنت", "heater cooler"] },
  { id: "care", label: "مراقبت و پایش بیمار", terms: ["بیمار", "مراقبت", "ونتیلاتور", "اکسیژن", "ecmo", "دیالیز", "پالس", "تزریق", "احیا"] },
  { id: "lab", label: "آزمایشگاه", terms: ["آزمایشگاه", "آزمایشگاهی", "آنالایزر", "یخچال", "فریزر", "بانک خون"] },
  { id: "dental", label: "دندان‌پزشکی و زیبایی", terms: ["دندان", "کلینیک زیبایی", "لیزر", "پوست"] },
  { id: "safety", label: "ایمنی و مقررات", terms: ["ایمنی", "مقررات", "استاندارد", "ثبت", "مجوز", "سایبری", "عفونت", "بازفرآوری", "استریل", "qmsr", "eudamed", "ifu", "udi"] },
  { id: "operations", label: "تأمین، نگهداری و زیرساخت", terms: ["تامین", "نگهداری", "تعمیر", "خدمات", "انبار", "بازار", "کمبود", "لجستیک", "زیرساخت", "برق", "کالیبراسیون", "cmms", "مدیریت", "قرارداد", "گازهای طبی"] },
];

/** @param {string} value */
export function normalizeBlogSearch(value) {
  return value.normalize("NFKD").replace(/\p{M}/gu, "")
    .replace(/[يى]/g, "ی").replace(/ك/g, "ک")
    .replace(/[۰-۹]/g, digit => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, digit => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim().replace(/\s+/g, " ");
}

/** @param {SearchPost} post @param {string} topic */
export function matchesBlogTopic(post, topic) {
  const selected = blogTopics.find(item => item.id === topic);
  if (!selected || !selected.terms.length) return true;
  const text = normalizeBlogSearch(`${post.title} ${post.category}`);
  return selected.terms.some(term => {
    const normalized = normalizeBlogSearch(term);
    return /^[a-z]+$/.test(normalized)
      ? text.split(" ").includes(normalized)
      : text.includes(normalized);
  });
}

/** @template {SearchPost} T @param {T[]} posts @param {string} query @param {string} [topic] */
export function filterBlogPosts(posts, query, topic = "all") {
  const tokens = normalizeBlogSearch(query).split(" ").filter(Boolean);
  return posts.filter(post => {
    if (!matchesBlogTopic(post, topic)) return false;
    const text = normalizeBlogSearch(`${post.title} ${post.excerpt} ${post.category}`).replace(/ /g, "");
    return tokens.every(token => text.includes(token));
  });
}

const stopWords = new Set(["برای", "پس", "پیش", "آزمون", "خرید", "جهانی", "ایران", "فقط", "کافی", "نیست", "بیشتر", "بهتر", "چگونه", "چرا", "تجهیزات", "پزشکی", "کنترل", "راهنمای", "مقاله", "روی", "درباره", "های"].map(normalizeBlogSearch));

/** @param {SearchPost[]} posts @param {string} query @param {string} [topic] */
export function suggestBlogSearch(posts, query, topic = "all") {
  const normalized = normalizeBlogSearch(query);
  if (normalized.length < 2) return [];
  const scoped = posts.filter(post => matchesBlogTopic(post, topic));
  const articles = filterBlogPosts(scoped, query).slice(0, 4).map(post => ({
    id: post.slug, value: post.title, kind: "article", label: "مقاله",
  }));
  const words = new Map();
  for (const post of scoped) {
    const originalWords = new Map((`${post.title} ${post.category}`.match(/[\p{L}\p{N}\u200c]+/gu)||[]).map(word => [normalizeBlogSearch(word), word]));
    for (const [word, original] of originalWords) {
      if (word.length >= 3 && !stopWords.has(word) && !/^\d+$/.test(word)
        && word.includes(normalized) && word !== normalized) {
        words.set(word, {word:original, count:(words.get(word)?.count || 0) + 1});
      }
    }
  }
  const keywords = [...words].sort((a, b) => b[1].count - a[1].count).slice(0, 2).map(([word, entry]) => ({
    id: `word-${word}`, value: entry.word, kind: "keyword", label: "کلیدواژه",
  }));
  return [...articles, ...keywords];
}
