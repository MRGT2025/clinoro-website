"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BookmarkCheck,
  Check,
  ClipboardList,
  Download,
  GitCompareArrows,
  Info,
  Search,
  Share2,
  Sparkles,
  Target,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import type { ProductItem } from "../../lib/site-content";

const filters = [
  ["all", "همه"],
  ["critical", "مراقبت ویژه"],
  ["imaging", "تصویربرداری"],
  ["lab", "آزمایشگاه"],
  ["surgery", "اتاق عمل"],
  ["sterile", "استریل"],
] as const;

const fixedRows: Array<[string, (product: ProductItem) => string]> = [
  ["برند", (product) => product.brand],
  ["مدل / پیکربندی", (product) => product.model],
  ["کاربرد موردنظر", (product) => product.intendedUse],
  ["وضعیت تأمین", (product) => product.availability],
];

const buyerIntents = [
  ["explore", "بررسی اولیه", "ساخت فهرست کوتاه و شناخت گزینه‌ها"],
  ["rfq", "استعلام فعال", "مقایسه فنی برای دریافت پیشنهاد"],
  ["replacement", "جایگزینی تجهیز", "کاهش ریسک توقف و انتقال بهره‌برداری"],
] as const;

const buyerPriorities = [
  ["performance", "عملکرد بالینی", "قابلیت، دقت و workflow"],
  ["lifecycle", "چرخه عمر", "سرویس، آموزش، قطعه و مصرفی"],
  ["timeline", "زمان اجرا", "تأمین، نصب و تحویل"],
] as const;

const decisionCoverage = (product: ProductItem) => {
  const fields = [
    product.brand,
    product.model,
    product.intendedUse,
    product.availability,
    product.summary,
    product.technicalSpecs.length ? "specs" : "",
    product.services.length ? "services" : "",
  ];
  return Math.round(
    (fields.filter((value) => Boolean(String(value).trim())).length /
      fields.length) *
      100,
  );
};

export function ProductBrowser({ products }: { products: ProductItem[] }) {
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [compareSlugs, setCompareSlugs] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [intent, setIntent] = useState<(typeof buyerIntents)[number][0]>(
    "explore",
  );
  const [priority, setPriority] = useState<
    (typeof buyerPriorities)[number][0]
  >("performance");
  const [hydrated, setHydrated] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const params = new URLSearchParams(window.location.search);
      const requestedCategory = params.get("category");
      const requestedIntent = params.get("intent");
      const requestedPriority = params.get("priority");
      const requestedQuery = params.get("q");
      if (filters.some(([id]) => id === requestedCategory))
        setCat(requestedCategory || "all");
      if (buyerIntents.some(([id]) => id === requestedIntent))
        setIntent(requestedIntent as (typeof buyerIntents)[number][0]);
      if (buyerPriorities.some(([id]) => id === requestedPriority))
        setPriority(requestedPriority as (typeof buyerPriorities)[number][0]);
      if (requestedQuery) setQ(requestedQuery);
      try {
        const fromUrl = (params.get("compare") || "")
          .split(",")
          .filter(Boolean);
        const fromStorage = JSON.parse(
          window.localStorage.getItem("clinoro-product-shortlist") || "[]",
        ) as string[];
        const next = (fromUrl.length ? fromUrl : fromStorage)
          .filter((slug) => products.some((product) => product.slug === slug))
          .slice(0, 3);
        setCompareSlugs(next);
      } catch {
        setCompareSlugs([]);
      }
      setHydrated(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [products]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(
      "clinoro-product-shortlist",
      JSON.stringify(compareSlugs),
    );
  }, [compareSlugs, hydrated]);

  const shown = useMemo(
    () =>
      products.filter(
        (product) =>
          (cat === "all" || product.cat === cat) &&
          (product.fa.includes(q) ||
            product.en.toLowerCase().includes(q.toLowerCase())),
      ),
    [cat, q, products],
  );
  const compared = compareSlugs
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is ProductItem => Boolean(product));
  const specLabels = Array.from(
    new Set(
      compared.flatMap((product) =>
        product.technicalSpecs.map((spec) => spec.label),
      ),
    ),
  );
  const currentIntent = buyerIntents.find(([id]) => id === intent)!;
  const currentPriority = buyerPriorities.find(([id]) => id === priority)!;
  const comparisonCoverage = compared.length
    ? Math.round(
        compared.reduce((sum, product) => sum + decisionCoverage(product), 0) /
          compared.length,
      )
    : 0;
  const comparisonCategories = new Set(compared.map((product) => product.cat));
  const missingDocuments = compared.filter(
    (product) => !product.documents.length,
  ).length;

  const toggleCompare = (slug: string) => {
    setCompareSlugs((current) => {
      if (current.includes(slug))
        return current.filter((item) => item !== slug);
      if (current.length === 3) return current;
      return [...current, slug];
    });
  };

  const comparisonUrl = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("compare", compareSlugs.join(","));
    url.searchParams.set("intent", intent);
    url.searchParams.set("priority", priority);
    return url.toString();
  };

  const shareComparison = async () => {
    const url = comparisonUrl();
    try {
      if (navigator.share) {
        await navigator.share({
          title: "مقایسه تجهیزات پزشکی Clinoro",
          text: compared.map((product) => product.fa).join("، "),
          url,
        });
        setNotice("لینک مقایسه آماده اشتراک شد.");
      } else {
        await navigator.clipboard.writeText(url);
        setNotice("لینک مقایسه کپی شد.");
      }
    } catch {
      setNotice("اشتراک لغو شد؛ انتخاب‌ها همچنان ذخیره هستند.");
    }
    window.setTimeout(() => setNotice(""), 2600);
  };

  const printComparison = () => {
    document.documentElement.classList.add("comparison-print-mode");
    window.print();
    window.setTimeout(
      () => document.documentElement.classList.remove("comparison-print-mode"),
      500,
    );
  };

  return (
    <section className="section products-section">
      <div className="site-wrap">
        <div className="catalog-decision-profile prism-edge">
          <header>
            <span>
              <Sparkles size={17} /> BUYER DECISION PROFILE
            </span>
            <h2>کاتالوگ را بر اساس تصمیم خرید خودتان ببینید</h2>
            <p>
              مرحله پروژه و اولویت اصلی را مشخص کنید؛ این پروفایل همراه انتخاب‌ها
              در لینک مقایسه و فرم استعلام حفظ می‌شود.
            </p>
          </header>
          <div className="catalog-profile-controls">
            <fieldset>
              <legend>مرحله پروژه</legend>
              {buyerIntents.map(([id, label, detail]) => (
                <button
                  type="button"
                  className={intent === id ? "active" : ""}
                  aria-pressed={intent === id}
                  onClick={() => setIntent(id)}
                  key={id}
                >
                  <b>{label}</b>
                  <small>{detail}</small>
                </button>
              ))}
            </fieldset>
            <fieldset>
              <legend>اولویت اصلی</legend>
              {buyerPriorities.map(([id, label, detail]) => (
                <button
                  type="button"
                  className={priority === id ? "active" : ""}
                  aria-pressed={priority === id}
                  onClick={() => setPriority(id)}
                  key={id}
                >
                  <b>{label}</b>
                  <small>{detail}</small>
                </button>
              ))}
            </fieldset>
          </div>
          <aside aria-live="polite">
            <Target size={22} />
            <div>
              <small>پروفایل فعال</small>
              <b>
                {currentIntent[1]} · {currentPriority[1]}
              </b>
              <span>{currentPriority[2]}</span>
            </div>
          </aside>
        </div>

        <div className="catalog-toolbar glass-panel">
          <div className="filter-row" aria-label="فیلتر گروه محصول">
            {filters.map(([id, label]) => (
              <button
                className={cat === id ? "active" : ""}
                aria-pressed={cat === id}
                onClick={() => setCat(id)}
                key={id}
              >
                {label}
              </button>
            ))}
          </div>
          <label className="catalog-search">
            <Search size={18} />
            <span className="sr-only">جستجوی محصول</span>
            <input
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder="جستجوی محصول..."
              name="q"
            />
          </label>
        </div>

        <div className="catalog-guidance">
          <div>
            <GitCompareArrows size={21} />
            <span>
              <b>مقایسه برای تصمیم خرید</b>
              <small>
                تا سه تجهیز را کنار هم بگذارید؛ انتخاب نهایی بعد از بررسی
                سناریوی پروژه انجام می‌شود.
              </small>
            </span>
          </div>
          <span>{compareSlugs.length.toLocaleString("fa-IR")} از ۳ انتخاب</span>
        </div>

        {notice && (
          <div className="catalog-notice" role="status">
            <BookmarkCheck size={17} /> {notice}
          </div>
        )}

        <div className="product-grid">
          {shown.map((product) => {
            const selected = compareSlugs.includes(product.slug);
            const limitReached = compareSlugs.length === 3 && !selected;
            return (
              <article className="product-card" key={product.slug}>
                <Link
                  className="product-image"
                  href={`/products/${product.slug}`}
                  aria-label={`مشاهده ${product.fa}`}
                >
                  <Image
                    src={product.image}
                    alt={`تصویر مرجع ${product.fa}`}
                    fill
                    unoptimized
                    sizes="(max-width:700px) 100vw,33vw"
                  />
                  <span>{product.tag}</span>
                  <small>تصویر مرجع</small>
                </Link>
                <div className="product-body">
                  <small>{product.en}</small>
                  <h2>{product.fa}</h2>
                  <p>{product.summary}</p>
                  <div className="product-decision-meta">
                    <span>
                      <small>برند</small>
                      <b>{product.brand || "در پیشنهاد نهایی"}</b>
                    </span>
                    <span>
                      <small>وضعیت</small>
                      <b>{product.availability || "نیازمند استعلام"}</b>
                    </span>
                    <span>
                      <small>پوشش اطلاعات</small>
                      <b>{decisionCoverage(product).toLocaleString("fa-IR")}٪</b>
                    </span>
                  </div>
                  <ul>
                    {product.specs.slice(0, 3).map((spec) => (
                      <li key={spec}>
                        <Check size={14} />
                        {spec}
                      </li>
                    ))}
                  </ul>
                  <div className="product-card-actions">
                    <Link href={`/products/${product.slug}`}>
                      مشخصات و خدمات <ArrowLeft size={17} />
                    </Link>
                    <button
                      type="button"
                      className={selected ? "selected" : ""}
                      disabled={limitReached}
                      aria-pressed={selected}
                      onClick={() => toggleCompare(product.slug)}
                      title={
                        limitReached
                          ? "حداکثر سه محصول قابل مقایسه است"
                          : undefined
                      }
                    >
                      {selected ? (
                        <Check size={16} />
                      ) : (
                        <GitCompareArrows size={16} />
                      )}
                      {selected ? "انتخاب شد" : "مقایسه"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        {!shown.length && (
          <div className="empty-state">محصولی با این عنوان پیدا نشد.</div>
        )}
      </div>

      {compared.length > 0 && (
        <div className="compare-tray" aria-live="polite">
          <div>
            <GitCompareArrows size={20} />
            <div className="compare-tray-thumbs" aria-hidden="true">
              {compared.map((product) => (
                <span key={product.slug}>
                  <Image
                    src={product.image}
                    alt=""
                    fill
                    unoptimized
                    sizes="42px"
                  />
                </span>
              ))}
            </div>
            <span>
              <b>{compared.length.toLocaleString("fa-IR")} تجهیز برای مقایسه</b>
              <small>
                {compared.map((product) => product.fa).join("، ")} · ذخیره خودکار
              </small>
            </span>
          </div>
          <div>
            <button
              type="button"
              className="compare-clear"
              onClick={() => setCompareSlugs([])}
            >
              <Trash2 size={16} /> پاک‌کردن
            </button>
            <button
              type="button"
              className="compare-open"
              onClick={() => setCompareOpen(true)}
            >
              مشاهده مقایسه
              <ArrowLeft size={17} />
            </button>
          </div>
        </div>
      )}

      {compareOpen && compared.length > 0 && (
        <div
          className="compare-layer"
          role="dialog"
          aria-modal="true"
          aria-labelledby="compare-title"
        >
          <button
            className="compare-backdrop"
            onClick={() => setCompareOpen(false)}
            aria-label="بستن مقایسه"
          />
          <section className="compare-dialog">
            <header>
              <div>
                <small>PROCUREMENT DECISION VIEW</small>
                <h2 id="compare-title">مقایسه تجهیزات انتخاب‌شده</h2>
                <p>
                  این جدول برای غربال اولیه است؛ تطبیق فنی، زیرساخت، مصرفی و
                  خدمات در استعلام نهایی بررسی می‌شود.
                </p>
              </div>
              <div className="compare-dialog-tools">
                <button
                  type="button"
                  onClick={() => void shareComparison()}
                  aria-label="اشتراک مقایسه"
                  title="اشتراک یا کپی لینک"
                >
                  <Share2 size={18} />
                </button>
                <button
                  type="button"
                  onClick={printComparison}
                  aria-label="چاپ یا ذخیره PDF"
                  title="چاپ یا ذخیره PDF"
                >
                  <Download size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setCompareOpen(false)}
                  aria-label="بستن"
                >
                  <X size={21} />
                </button>
              </div>
            </header>
            <div className="compare-decision-summary">
              <article>
                <Target size={18} />
                <span>
                  <small>پروفایل تصمیم</small>
                  <b>
                    {currentIntent[1]} · {currentPriority[1]}
                  </b>
                </span>
              </article>
              <article>
                <ClipboardList size={18} />
                <span>
                  <small>پوشش اطلاعات اولیه</small>
                  <b>{comparisonCoverage.toLocaleString("fa-IR")}٪</b>
                </span>
              </article>
              <article className={comparisonCategories.size > 1 ? "warn" : ""}>
                <GitCompareArrows size={18} />
                <span>
                  <small>دامنه مقایسه</small>
                  <b>
                    {comparisonCategories.size > 1
                      ? "گروه‌های متفاوت"
                      : "یک گروه محصول"}
                  </b>
                </span>
              </article>
              <article className={missingDocuments ? "warn" : ""}>
                <Info size={18} />
                <span>
                  <small>دیتاشیت مدل نهایی</small>
                  <b>
                    {missingDocuments
                      ? `${missingDocuments.toLocaleString("fa-IR")} مورد نیازمند استعلام`
                      : "در دسترس"}
                  </b>
                </span>
              </article>
            </div>
            <div className="compare-scope-note">
              <Info size={17} />
              <p>
                تفاوت‌ها برجسته شده‌اند. نتیجه این صفحه غربال اولیه است؛ برند، مدل،
                پیکربندی، زیرساخت و خدمات باید در پیشنهاد رسمی همان پروژه تأیید شوند.
              </p>
            </div>
            <div className="compare-scroll">
              <div
                className="compare-table"
                style={{ "--compare-count": compared.length } as CSSProperties}
              >
                <div className="compare-row compare-products">
                  <b>محصول</b>
                  {compared.map((product) => (
                    <article key={product.slug}>
                      <div>
                        <Image
                          src={product.image}
                          alt={`تصویر مرجع ${product.fa}`}
                          fill
                          unoptimized
                          sizes="220px"
                        />
                      </div>
                      <span>{product.en}</span>
                      <strong>{product.fa}</strong>
                      <button
                        type="button"
                        onClick={() => toggleCompare(product.slug)}
                      >
                        <X size={14} /> حذف
                      </button>
                    </article>
                  ))}
                </div>
                {fixedRows.map(([label, value]) => {
                  const values = compared.map((product) => value(product) || "—");
                  const different = new Set(values).size > 1;
                  return (
                    <div
                      className={`compare-row${different ? " has-difference" : ""}`}
                      key={label}
                    >
                      <b>{label}</b>
                      {compared.map((product, index) => (
                        <span key={product.slug}>{values[index]}</span>
                      ))}
                    </div>
                  );
                })}
                {specLabels.map((label) => {
                  const values = compared.map(
                    (product) =>
                      product.technicalSpecs.find(
                        (spec) => spec.label === label,
                      )?.value || "—",
                  );
                  const different = new Set(values).size > 1;
                  return (
                    <div
                      className={`compare-row${different ? " has-difference" : ""}`}
                      key={label}
                    >
                      <b>{label}</b>
                      {compared.map((product, index) => (
                        <span key={product.slug}>{values[index]}</span>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
            <footer>
              <span>
                برای دریافت پیشنهاد قابل اتکا، جزئیات مرکز و پروژه را در فرم
                استعلام بنویسید.
              </span>
              <Link
                href={`/contact?products=${encodeURIComponent(compareSlugs.join(","))}&intent=${intent}&priority=${priority}`}
              >
                استعلام این انتخاب‌ها <ArrowLeft size={18} />
              </Link>
            </footer>
          </section>
        </div>
      )}
    </section>
  );
}
