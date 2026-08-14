"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  GitCompareArrows,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState, type CSSProperties } from "react";
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

export function ProductBrowser({ products }: { products: ProductItem[] }) {
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [compareSlugs, setCompareSlugs] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

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

  const toggleCompare = (slug: string) => {
    setCompareSlugs((current) => {
      if (current.includes(slug))
        return current.filter((item) => item !== slug);
      if (current.length === 3) return current;
      return [...current, slug];
    });
  };

  return (
    <section className="section products-section">
      <div className="site-wrap">
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
            <span>
              <b>{compared.length.toLocaleString("fa-IR")} تجهیز برای مقایسه</b>
              <small>{compared.map((product) => product.fa).join("، ")}</small>
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
              <button
                type="button"
                onClick={() => setCompareOpen(false)}
                aria-label="بستن"
              >
                <X size={21} />
              </button>
            </header>
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
                {fixedRows.map(([label, value]) => (
                  <div className="compare-row" key={label}>
                    <b>{label}</b>
                    {compared.map((product) => (
                      <span key={product.slug}>{value(product) || "—"}</span>
                    ))}
                  </div>
                ))}
                {specLabels.map((label) => (
                  <div className="compare-row" key={label}>
                    <b>{label}</b>
                    {compared.map((product) => (
                      <span key={product.slug}>
                        {product.technicalSpecs.find(
                          (spec) => spec.label === label,
                        )?.value || "—"}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <footer>
              <span>
                برای دریافت پیشنهاد قابل اتکا، جزئیات مرکز و پروژه را در فرم
                استعلام بنویسید.
              </span>
              <Link
                href={`/contact?products=${encodeURIComponent(compareSlugs.join(","))}`}
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
