import type { Metadata } from "next";
import { getSiteContent } from "../../../lib/site-content";
import { ContactForm } from "../../contact/contact-form";
import { EnglishShell } from "../en-shell";

export const metadata: Metadata = {
  title: "Start a Medical Equipment RFQ",
  description:
    "Share your clinical environment, intended use, timeline and service requirements with Clinoro.",
  keywords: [
    "medical equipment RFQ",
    "equipment procurement request",
    "medical equipment quotation",
    "healthcare project consultation",
  ],
  alternates: {
    canonical: "/en/contact",
    languages: {
      "fa-IR": "/contact",
      en: "/en/contact",
      "x-default": "/en/contact",
    },
  },
  openGraph: {
    title: "Start a Medical Equipment RFQ | Clinoro",
    description:
      "Share intended use, project context, timeline and service expectations in one structured request.",
    url: "/en/contact",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Start a Medical Equipment RFQ | Clinoro",
    description:
      "Share intended use, project context, timeline and service expectations in one structured request.",
  },
};

export default async function EnglishContact({
  searchParams,
}: {
  searchParams: Promise<{ product?: string | string[] }>;
}) {
  const content = await getSiteContent();
  const query = await searchParams;
  const product = Array.isArray(query.product)
    ? query.product[0]
    : query.product;
  const schema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Start a Medical Equipment RFQ",
    url: "https://clinoromedical.com/en/contact",
    inLanguage: "en",
    about: {
      "@type": "Service",
      name: "Medical equipment procurement request",
    },
  };

  return (
    <EnglishShell content={content} active="/en/contact">
      <main id="main-content" className="global-contact">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <section className="global-inner-hero">
          <div className="site-wrap">
            <span>STRUCTURED RFQ</span>
            <h1>{content.international.contactTitle}</h1>
            <p>{content.international.contactText}</p>
          </div>
        </section>
        <ContactForm initialProductSlug={product} locale="en" />
      </main>
    </EnglishShell>
  );
}
