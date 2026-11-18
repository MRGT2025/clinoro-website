import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Gauge,
  GraduationCap,
  Network,
  PackageSearch,
  ShieldCheck,
} from "lucide-react";
import { cleanName, productMetaDescription, publicProductView } from "../../../../lib/catalog";
import { getSiteContent } from "../../../../lib/site-content";
import { EnglishShell } from "../../en-shell";
import { optimizedAssetUrl } from "../../../../lib/assets";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const content = await getSiteContent();
  const product = content.products.find((item) => item.slug === slug);
  if (!product) return { title: "Equipment not found" };
  const name = cleanName(product.en);
  const description = productMetaDescription(product, "en");
  return {
    title: `${name} | Medical Equipment`,
    description,
    keywords: [name, product.productType === "consumable" ? "aesthetic consumable" : "medical equipment procurement", product.tag].filter(Boolean),
    alternates: {
      canonical: `/en/products/${slug}`,
      languages: {
        "fa-IR": `/products/${slug}`,
        en: `/en/products/${slug}`,
        "x-default": `/en/products/${slug}`,
      },
    },
    openGraph: {
      title: `${name} | Clinoro`,
      description,
      url: `/en/products/${slug}`,
      locale: "en_US",
      type: "website",
      images: [{ url: product.image, alt: `Reference image for ${name}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | Clinoro`,
      description,
      images: [product.image],
    },
  };
}

export default async function EnglishProductDetail({ params }: Params) {
  const { slug } = await params;
  const content = await getSiteContent();
  const product = content.products.find((item) => item.slug === slug);
  if (!product) notFound();
  const view = publicProductView(product);
  const intelligence = [
    view.leadTimeEn ? ["Lead time", view.leadTimeEn] : null,
    view.warrantyEn ? ["Warranty", view.warrantyEn] : null,
    view.slaEn ? ["Service response", view.slaEn] : null,
    view.documents.length ? ["Official files", `${view.documents.length} available`] : null,
  ].filter((item): item is [string, string] => Boolean(item));
  const workstreams = [
    view.infrastructureEn.length ? { title: "Infrastructure", items: view.infrastructureEn, icon: <Network /> } : null,
    view.consumableNotesEn.length ? { title: "Consumables", items: view.consumableNotesEn, icon: <PackageSearch /> } : null,
    view.trainingEn.length ? { title: "Training", items: view.trainingEn, icon: <GraduationCap /> } : null,
    view.acceptanceEn.length ? { title: "Acceptance", items: view.acceptanceEn, icon: <ClipboardCheck /> } : null,
    view.lifecycleEn.length ? { title: "Lifecycle", items: view.lifecycleEn, icon: <Gauge /> } : null,
    view.tcoEn.length ? { title: "TCO factors", items: view.tcoEn, icon: <FileText /> } : null,
  ].filter((item): item is { title: string; items: string[]; icon: ReactNode } => Boolean(item));
  const questions = [...view.specsEn, ...view.servicesEn];
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://clinoromedical.com/en/products/" + product.slug + "#webpage",
    url: "https://clinoromedical.com/en/products/" + product.slug,
    name: view.en,
    description: view.metaDescriptionEn,
    inLanguage: "en",
    mainEntity: { "@type": "Thing", name: view.en },
  };

  return (
    <EnglishShell content={content} active="/en/products">
      <main id="main-content" className="global-product-detail">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
        <section className="global-product-hero">
          <div className="site-wrap">
            <div className="global-product-media">
              <Image src={optimizedAssetUrl(product.image)} alt={`Reference image for ${view.en}`} fill priority unoptimized sizes="(max-width:900px) 100vw,50vw" />
              {product.imageLicense && <small>REFERENCE IMAGE · {product.imageLicense}</small>}
            </div>
            <article>
              <Link href="/en/products">
                <ArrowLeft size={15} /> Equipment intelligence
              </Link>
              {view.tag && <span>{view.tag}</span>}
              <h1>{view.en}</h1>
              {view.summaryEn && <p>{view.summaryEn}</p>}
              <dl>
                <div>
                  <dt>Evidence level</dt>
                  <dd>
                    {view.evidenceLevel === "category"
                      ? "Category guidance"
                      : view.evidenceLevel === "model"
                        ? "Model identified"
                        : "Verified model evidence"}
                  </dd>
                </div>
                {!view.consumable && (
                  <div>
                    <dt>Supply status</dt>
                    <dd>Confirmed only in the official proposal</dd>
                  </div>
                )}
              </dl>
              <div>
                <Link href={`/en/contact?product=${product.slug}`}>
                  Request a model-level proposal <ArrowRight size={17} />
                </Link>
                <Link href={`/products/${product.slug}`}>فارسی</Link>
              </div>
            </article>
          </div>
        </section>
        <section className="section">
          <div className="site-wrap global-detail-layout">
            <div>
              {view.intendedUseEn && (
                <article className="global-detail-card">
                  <span>INTENDED USE</span>
                  <h2>Clinical scope</h2>
                  <p>{view.intendedUseEn}</p>
                  <div>
                    <ShieldCheck size={19} />
                    {view.consumable
                      ? "Final composition, authenticity and storage conditions must be confirmed on the product leaflet."
                      : "Final intended use and indications must be confirmed against the official documentation for the selected model."}
                  </div>
                </article>
              )}
              {intelligence.length > 0 && (
                <article className="global-detail-card">
                  <span>PROCUREMENT INTELLIGENCE</span>
                  <h2>Project commitments that still require confirmation</h2>
                  <div className="global-intelligence-grid">
                    {intelligence.map(([label, value]) => (
                      <article key={label}>
                        <small>{label}</small>
                        <b>{value}</b>
                      </article>
                    ))}
                  </div>
                </article>
              )}
              {!view.consumable && workstreams.length > 0 && (
                <article className="global-detail-card">
                  <span>DECISION PACK</span>
                  <h2>{workstreams.length === 6 ? "Six workstreams for the final RFQ" : "Workstreams for the final RFQ"}</h2>
                  <div className="global-decision-grid">
                    {workstreams.map((stream) => (
                      <DecisionWorkstream key={stream.title} icon={stream.icon} title={stream.title} items={stream.items} />
                    ))}
                  </div>
                </article>
              )}
            </div>
            <aside>
              {questions.length > 0 && (
                <article>
                  <span>KEY QUESTIONS</span>
                  <h2>Before requesting a quote</h2>
                  {questions.map((item) => (
                    <p key={item}>
                      <CheckCircle2 size={15} />
                      {item}
                    </p>
                  ))}
                </article>
              )}
              {view.showImageCredit && (
                <article>
                  <small>IMAGE SOURCE</small>
                  <a href={product.imageSource} target="_blank" rel="license noreferrer">
                    {product.imageCredit}{product.imageLicense ? ` · ${product.imageLicense}` : ""}
                  </a>
                  <p>The image represents the product category and does not imply brand representation or supply.</p>
                </article>
              )}
              <Link href={`/en/contact?product=${product.slug}`}>
                Start a structured RFQ <ArrowRight size={17} />
              </Link>
            </aside>
          </div>
        </section>
      </main>
    </EnglishShell>
  );
}

function DecisionWorkstream({ icon, title, items }: { icon: ReactNode; title: string; items: string[] }) {
  return (
    <article>
      {icon}
      <b>{title}</b>
      <p>{items.join(" · ")}</p>
    </article>
  );
}
