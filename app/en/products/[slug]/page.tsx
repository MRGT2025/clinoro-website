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
import { getSiteContent } from "../../../../lib/site-content";
import { EnglishShell } from "../../en-shell";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const content = await getSiteContent();
  const product = content.products.find((item) => item.slug === slug);
  if (!product) return { title: "Equipment not found" };
  return {
    title: `${product.en} | Medical Equipment`,
    description: product.international.summary,
    keywords: [
      product.en,
      "medical equipment procurement",
      product.tag,
      "equipment lifecycle planning",
    ],
    alternates: {
      canonical: `/en/products/${slug}`,
      languages: {
        "fa-IR": `/products/${slug}`,
        en: `/en/products/${slug}`,
        "x-default": `/en/products/${slug}`,
      },
    },
    openGraph: {
      title: `${product.en} | Clinoro`,
      description: product.international.summary,
      url: `/en/products/${slug}`,
      locale: "en_US",
      type: "website",
      images: [
        { url: product.image, alt: `Reference image for ${product.en}` },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.en} | Clinoro`,
      description: product.international.summary,
      images: [product.image],
    },
  };
}

export default async function EnglishProductDetail({ params }: Params) {
  const { slug } = await params;
  const content = await getSiteContent();
  const product = content.products.find((item) => item.slug === slug);
  if (!product) notFound();
  const procurement = product.international.procurement;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.en,
    description: product.international.summary,
    inLanguage: "en",
    image: `https://clinoromedical.com${product.image}`,
    category: product.tag,
    url: `https://clinoromedical.com/en/products/${product.slug}`,
    audience: {
      "@type": "Audience",
      audienceType: "Healthcare procurement and clinical engineering teams",
    },
    additionalProperty: [
      ...product.international.specs.map((value, index) => ({
        "@type": "PropertyValue",
        name: `Decision criterion ${index + 1}`,
        value,
      })),
      {
        "@type": "PropertyValue",
        name: "Evidence level",
        value: product.procurement.evidenceLevel,
      },
      {
        "@type": "PropertyValue",
        name: "Lead time",
        value: procurement.leadTime,
      },
    ],
  };

  return (
    <EnglishShell content={content} active="/en/products">
      <main id="main-content" className="global-product-detail">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <section className="global-product-hero">
          <div className="site-wrap">
            <div className="global-product-media">
              <Image
                src={product.image}
                alt={`Reference image for ${product.en}`}
                fill
                priority
                unoptimized
                sizes="(max-width:900px) 100vw,50vw"
              />
              <small>REFERENCE IMAGE · {product.imageLicense}</small>
            </div>
            <article>
              <Link href="/en/products">
                <ArrowLeft size={15} /> Equipment intelligence
              </Link>
              <span>{product.tag}</span>
              <h1>{product.en}</h1>
              <p>{product.international.summary}</p>
              <dl>
                <div>
                  <dt>Evidence level</dt>
                  <dd>
                    {product.procurement.evidenceLevel === "category"
                      ? "Category guidance"
                      : product.procurement.evidenceLevel === "model"
                        ? "Model identified"
                        : "Verified model evidence"}
                  </dd>
                </div>
                <div>
                  <dt>Supply status</dt>
                  <dd>Confirmed only in the official proposal</dd>
                </div>
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
              <article className="global-detail-card">
                <span>INTENDED USE</span>
                <h2>Clinical scope</h2>
                <p>{product.international.intendedUse}</p>
                <div>
                  <ShieldCheck size={19} />
                  Final intended use and indications must be confirmed against the
                  official documentation for the selected model.
                </div>
              </article>
              <article className="global-detail-card">
                <span>PROCUREMENT INTELLIGENCE</span>
                <h2>Project commitments that still require confirmation</h2>
                <div className="global-intelligence-grid">
                  <article>
                    <small>Lead time</small>
                    <b>{procurement.leadTime}</b>
                  </article>
                  <article>
                    <small>Warranty</small>
                    <b>{procurement.warranty}</b>
                  </article>
                  <article>
                    <small>Service response</small>
                    <b>{procurement.serviceResponse}</b>
                  </article>
                  <article>
                    <small>Official files</small>
                    <b>
                      {product.documents.length
                        ? `${product.documents.length} available`
                        : "Requested with final model"}
                    </b>
                  </article>
                </div>
              </article>
              <article className="global-detail-card">
                <span>DECISION PACK</span>
                <h2>Six workstreams for the final RFQ</h2>
                <div className="global-decision-grid">
                  <DecisionWorkstream
                    icon={<Network />}
                    title="Infrastructure"
                    items={procurement.infrastructure}
                  />
                  <DecisionWorkstream
                    icon={<PackageSearch />}
                    title="Consumables"
                    items={procurement.consumables}
                  />
                  <DecisionWorkstream
                    icon={<GraduationCap />}
                    title="Training"
                    items={procurement.training}
                  />
                  <DecisionWorkstream
                    icon={<ClipboardCheck />}
                    title="Acceptance"
                    items={procurement.acceptance}
                  />
                  <DecisionWorkstream
                    icon={<Gauge />}
                    title="Lifecycle"
                    items={procurement.lifecycle}
                  />
                  <DecisionWorkstream
                    icon={<FileText />}
                    title="TCO factors"
                    items={procurement.tcoFactors}
                  />
                </div>
              </article>
            </div>
            <aside>
              <article>
                <span>KEY QUESTIONS</span>
                <h2>Before requesting a quote</h2>
                {[...product.international.specs, ...product.international.services].map(
                  (item) => (
                    <p key={item}>
                      <CheckCircle2 size={15} />
                      {item}
                    </p>
                  ),
                )}
              </article>
              <article>
                <small>IMAGE SOURCE</small>
                <a
                  href={product.imageSource}
                  target="_blank"
                  rel="license noreferrer"
                >
                  {product.imageCredit} · {product.imageLicense}
                </a>
                <p>
                  The image represents the product category and does not imply
                  brand representation or supply.
                </p>
              </article>
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

function DecisionWorkstream({
  icon,
  title,
  items,
}: {
  icon: ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <article>
      {icon}
      <b>{title}</b>
      <p>{items.join(" · ")}</p>
    </article>
  );
}
