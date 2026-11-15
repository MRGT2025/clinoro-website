import type { ReactNode } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Activity, ArrowLeft, Check, ChevronLeft, ClipboardCheck, Download, FileText, Gauge, GraduationCap, Network, PackageSearch, ShieldCheck, Target, Wrench } from "lucide-react";
import { cleanName, productMetaDescription, publicProductView } from "../../../lib/catalog";
import { getSiteContent } from "../../../lib/site-content";
import { PageShell } from "../../components";

type ProductParams = { params: Promise<{ slug: string }> };

const evidenceLabels = {
  category: "اطلاعات گروه محصول",
  model: "مدل مشخص",
  verified: "مدل و مدارک تأییدشده",
} as const;

export async function generateMetadata({ params }: ProductParams): Promise<Metadata> {
  const { slug } = await params;
  const content = await getSiteContent();
  const product = content.products.find((item) => item.slug === slug);
  if (!product) return { title: "محصول پیدا نشد" };
  const name = cleanName(product.fa);
  const title = `${name} | تجهیزات پزشکی`;
  const socialTitle = `${title} | Clinoro`;
  const description = productMetaDescription(product, "fa");
  return {
    title,
    description,
    alternates: {
      canonical: `/products/${product.slug}`,
      languages: { "fa-IR": `/products/${product.slug}`, en: `/en/products/${product.slug}` },
    },
    openGraph: {
      title: socialTitle,
      description,
      url: `/products/${product.slug}`,
      type: "website",
      images: [{ url: product.image, alt: `تصویر مرجع ${name}` }],
    },
    twitter: { card: "summary_large_image", title: socialTitle, description, images: [product.image] },
  };
}

export default async function ProductDetailPage({ params }: ProductParams) {
  const { slug } = await params;
  const content = await getSiteContent();
  const product = content.products.find((item) => item.slug === slug);
  if (!product) notFound();
  const view = publicProductView(product);
  const facts = [
    view.brand ? ["برند", view.brand] : null,
    view.model ? ["مدل", view.model] : null,
    view.availability ? ["وضعیت تأمین", view.availability] : null,
  ].filter((item): item is [string, string] => Boolean(item));
  const intelligence = [
    ["سطح شواهد فعلی", evidenceLabels[view.evidenceLevel]],
    view.leadTime ? ["زمان تأمین", view.leadTime] : null,
    view.warranty ? ["دامنه گارانتی", view.warranty] : null,
    view.sla ? ["SLA خدمات", view.sla] : null,
  ].filter((item): item is [string, string] => Boolean(item));
  const pack = [
    view.intendedUse ? ["کاربرد بالینی", view.intendedUse, <Target key="use" />] : null,
    view.infrastructure.length ? ["زیرساخت و اتصال", view.infrastructure.join("، "), <Network key="infra" />] : null,
    view.consumableNotes.length ? ["مصرفی و قطعه", view.consumableNotes.join("، "), <PackageSearch key="parts" />] : null,
    view.training.length ? ["آموزش", view.training.join("، "), <GraduationCap key="train" />] : null,
    view.acceptance.length ? ["آزمون پذیرش", view.acceptance.join("، "), <ClipboardCheck key="accept" />] : null,
    view.lifecycle.length ? ["چرخه عمر", view.lifecycle.join("، "), <Gauge key="life" />] : null,
  ].filter((item): item is [string, string, ReactNode] => Boolean(item));
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: view.fa,
    alternateName: view.en,
    description: view.metaDescriptionFa,
    image: `https://clinoromedical.com${product.image}`,
    category: product.tag,
    ...(product.procurement.evidenceLevel !== "category" && view.brand ? { brand: { "@type": "Brand", name: view.brand } } : {}),
    ...(product.procurement.evidenceLevel !== "category" && view.model ? { model: view.model } : {}),
    url: `https://clinoromedical.com/products/${product.slug}`,
    audience: { "@type": "Audience", audienceType: "Hospitals, clinics and healthcare procurement teams" },
    additionalProperty: [
      ...view.technicalSpecs.map((spec) => ({ "@type": "PropertyValue", name: spec.label || "Specification", value: spec.value || spec.label })),
      { "@type": "PropertyValue", name: "Evidence level", value: product.procurement.evidenceLevel },
      view.leadTime ? { "@type": "PropertyValue", name: "Lead time", value: view.leadTime } : null,
      view.warranty ? { "@type": "PropertyValue", name: "Warranty scope", value: view.warranty } : null,
      view.sla ? { "@type": "PropertyValue", name: "Service response", value: view.sla } : null,
    ].filter(Boolean),
    ...(view.documents.length
      ? { subjectOf: view.documents.map((document) => ({ "@type": "DigitalDocument", name: document.title, encodingFormat: document.type, url: document.url })) }
      : {}),
  };
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "خانه", item: "https://clinoromedical.com/" },
      { "@type": "ListItem", position: 2, name: "محصولات", item: "https://clinoromedical.com/products" },
      { "@type": "ListItem", position: 3, name: view.fa, item: `https://clinoromedical.com/products/${product.slug}` },
    ],
  };
  const questions = view.consumable
    ? [
        view.intendedUse || view.summary
          ? { name: `${view.fa} چه کاربردی دارد؟`, text: view.intendedUse || view.summary }
          : null,
        { name: "آیا مشخصات این صفحه قطعی است؟", text: "مشخصات نهایی، اصالت و شرایط نگهداری فقط در برگه محصول و پیشنهاد رسمی تأیید می‌شود." },
      ]
    : [
        { name: `پیش از خرید ${view.fa} چه اطلاعاتی باید مشخص شود؟`, text: "کاربرد موردنظر، ظرفیت، زیرساخت محل، مدل و پیکربندی نهایی، مصرفی‌ها، آموزش و محدوده خدمات باید در پیشنهاد فنی ثبت شوند." },
        { name: "آیا مشخصات این صفحه مشخصات قطعی محصول است؟", text: "خیر. این صفحه گروه محصول را معرفی می‌کند و مشخصات قطعی فقط در دیتاشیت رسمی برند و مدل منتخب تأیید می‌شود." },
        view.services.length ? { name: "چه خدماتی باید همراه پیشنهاد بررسی شود؟", text: view.services.join("، ") } : null,
      ];
  const faqEntries = questions.filter((item): item is { name: string; text: string } => Boolean(item && item.text.trim()));
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqEntries.map((item) => ({ "@type": "Question", name: item.name, acceptedAnswer: { "@type": "Answer", text: item.text } })),
  };

  return (
    <PageShell active="/products">
      <main id="main-content" className="product-detail-page">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
        {faqEntries.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />}
        <section className="product-detail-hero">
          <div className="product-detail-aura" />
          <div className="site-wrap product-detail-hero-grid">
            <div className="product-detail-media prism-edge">
              <Image src={product.image} alt={`تصویر مرجع ${view.consumable ? view.fa : `گروه محصول ${view.fa}`}`} fill priority unoptimized sizes="(max-width:900px) 100vw,52vw" />
              {product.imageLicense && <span>REFERENCE IMAGE · {product.imageLicense}</span>}
            </div>
            <div className="product-detail-copy glass-panel prism-edge">
              <div className="breadcrumbs">
                <Link href="/">خانه</Link>
                <ChevronLeft size={14} />
                <Link href="/products">محصولات</Link>
                <ChevronLeft size={14} />
                <span>{view.fa}</span>
              </div>
              {view.tag && <span className="hero-kicker">{view.tag}</span>}
              <h1>{view.fa}</h1>
              {view.en && <small>{view.en}</small>}
              {view.summary && <p>{view.summary}</p>}
              {facts.length > 0 && (
                <dl>
                  {facts.map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              <div className="inner-actions">
                <Link className="button button-primary" href={`/contact?product=${product.slug}`}>
                  درخواست پیشنهاد و دیتاشیت <ArrowLeft size={17} />
                </Link>
                <Link className="button button-glass" href={`/products?compare=${product.slug}`}>
                  افزودن به مقایسه
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="section product-detail-content">
          <div className="site-wrap product-detail-layout">
            <div className="product-detail-main">
              {view.showIntended && (
                <article className="detail-card glass-panel">
                  <span className="eyebrow">INTENDED USE</span>
                  <h2>کاربرد و دامنه انتخاب</h2>
                  <p>{view.intendedUse}</p>
                  <div className="product-disclaimer">
                    <ShieldCheck size={20} />
                    <p>
                      {view.consumable
                        ? "اطلاعات این صفحه برای معرفی محصول است. مشخصات نهایی، اصالت و شرایط نگهداری فقط در برگه محصول و پیشنهاد رسمی تأیید می‌شود."
                        : "اطلاعات این صفحه برای معرفی گروه محصول است. مشخصات نهایی، برند، مدل و کاربرد مجاز فقط در پیشنهاد فنی و دیتاشیت رسمی مدل منتخب تأیید می‌شود."}
                    </p>
                  </div>
                </article>
              )}
              {view.showTechnical && (
                <article className="detail-card glass-panel">
                  <span className="eyebrow">TECHNICAL PROFILE</span>
                  <h2>مشخصات قابل انتخاب</h2>
                  <div className="technical-table">
                    {view.technicalSpecs.map((spec) => (
                      <div key={`${spec.label}-${spec.value}`}>
                        <b>{spec.label}</b>
                        {spec.value && <span>{spec.value}</span>}
                      </div>
                    ))}
                  </div>
                </article>
              )}
              {view.showIntelligence && intelligence.length > 0 && (
                <article className="detail-card glass-panel product-intelligence-card">
                  <span className="eyebrow">PRODUCT INTELLIGENCE</span>
                  <h2>{view.consumable ? "وضعیت عرضه" : "وضعیت تصمیم‌پذیری و تعهدات پروژه"}</h2>
                  <div className="product-intelligence-grid">
                    {intelligence.map(([label, value]) => (
                      <article key={label}>
                        <small>{label}</small>
                        <b>{value}</b>
                      </article>
                    ))}
                  </div>
                  {!view.consumable && <p>این وضعیت به‌جای ساختن ادعای غیرقابل اثبات، دقیقاً نشان می‌دهد چه مواردی باید در پیشنهاد رسمی مدل منتخب نهایی شوند.</p>}
                </article>
              )}
              {view.showDecisionPack && pack.length > 0 && (
                <article className="detail-card glass-panel product-decision-pack">
                  <span className="eyebrow">PROCUREMENT DECISION PACK</span>
                  <h2>بسته تصمیم خرید این گروه محصول</h2>
                  <p>{pack.length === 6 ? "پیشنهاد قابل اتکا فقط مشخصات دستگاه نیست؛ این شش محور باید هم‌زمان برای همان مرکز و همان مدل بسته شوند." : "پیشنهاد قابل اتکا فقط مشخصات دستگاه نیست؛ این محورها باید هم‌زمان برای همان مرکز و همان مدل بسته شوند."}</p>
                  <div className="decision-pack-grid">
                    {pack.map(([title, text, icon]) => (
                      <article key={title}>
                        {icon}
                        <b>{title}</b>
                        <span>{text}</span>
                      </article>
                    ))}
                  </div>
                </article>
              )}
              {view.showDocuments && (
                <article className="detail-card glass-panel">
                  <span className="eyebrow">DOCUMENTS</span>
                  <h2>دیتاشیت و مدارک</h2>
                  <div className="document-list">
                    {view.documents.map((document) => (
                      <a href={document.url} target="_blank" rel="noreferrer" key={`${document.title}-${document.url}`}>
                        <FileText size={19} />
                        <span>
                          <b>{document.title}</b>
                          <small>{document.type}</small>
                        </span>
                        <Download size={17} />
                      </a>
                    ))}
                  </div>
                </article>
              )}
            </div>
            <aside className="product-detail-aside">
              {view.showSpecs && (
                <article className="detail-card glass-panel">
                  <span className="eyebrow">KEY POINTS</span>
                  <h2>ویژگی‌های کلیدی</h2>
                  <ul>
                    {view.specs.map((spec) => (
                      <li key={spec}>
                        <Check size={16} />
                        {spec}
                      </li>
                    ))}
                  </ul>
                </article>
              )}
              {view.showServices && (
                <article className="detail-card glass-panel">
                  <span className="eyebrow">LIFECYCLE SERVICES</span>
                  <h2>خدمات همراه</h2>
                  <ul>
                    {view.services.map((service) => (
                      <li key={service}>
                        <Wrench size={16} />
                        {service}
                      </li>
                    ))}
                  </ul>
                </article>
              )}
              {view.showReadiness && (
                <article className="detail-card glass-panel product-readiness-card">
                  <span className="eyebrow">BEFORE RFQ</span>
                  <h2>اطلاعات لازم برای پیشنهاد دقیق</h2>
                  <ul>
                    <li><Activity size={16} />نوع مرکز و کاربرد اصلی</li>
                    <li><Network size={16} />زیرساخت و سیستم‌های متصل</li>
                    <li><Gauge size={16} />ظرفیت یا حجم استفاده</li>
                    <li><ShieldCheck size={16} />انتظارات خدمات و آموزش</li>
                  </ul>
                  <Link href={`/contact?product=${product.slug}`}>
                    تکمیل اطلاعات پروژه <ArrowLeft size={16} />
                  </Link>
                </article>
              )}
              {view.showImageCredit && (
                <article className="image-credit-card">
                  <small>اعتبار تصویر مرجع</small>
                  <a href={product.imageSource || undefined} target="_blank" rel="license noreferrer">
                    {product.imageCredit}{product.imageLicense ? ` · ${product.imageLicense}` : ""}
                  </a>
                  <p>تصویر صرفاً نماینده گروه محصول است و به معنی عرضه برند نمایش‌داده‌شده نیست.</p>
                </article>
              )}
            </aside>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
