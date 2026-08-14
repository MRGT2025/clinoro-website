import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  LockKeyhole,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { getSiteContent } from "../../../lib/site-content";
import { EnglishShell } from "../en-shell";

export const metadata: Metadata = {
  title: "Trust & Verification Standard",
  description:
    "Clinoro transparency standard for equipment information, evidence, acceptance and lifecycle commitments.",
  keywords: [
    "medical equipment verification",
    "procurement transparency",
    "equipment acceptance",
    "medical equipment documentation",
  ],
  alternates: {
    canonical: "/en/credentials",
    languages: {
      "fa-IR": "/credentials",
      en: "/en/credentials",
      "x-default": "/en/credentials",
    },
  },
  openGraph: {
    title: "Trust & Verification Standard | Clinoro",
    description:
      "How Clinoro separates guidance, verified evidence and project-specific commitments.",
    url: "/en/credentials",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Trust & Verification Standard | Clinoro",
    description:
      "How Clinoro separates guidance, verified evidence and project-specific commitments.",
  },
};

export default async function EnglishCredentials() {
  const content = await getSiteContent();
  const items = content.trustItems.filter(
    (item) => item.published && item.verified,
  );
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Clinoro Trust & Verification Standard",
    url: "https://clinoromedical.com/en/credentials",
    inLanguage: "en",
    description:
      "Transparency standard for evidence, acceptance and lifecycle commitments.",
  };

  return (
    <EnglishShell content={content} active="/en/credentials">
      <main id="main-content" className="global-credentials">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <section className="global-inner-hero">
          <div className="site-wrap">
            <span>TRUST & VERIFICATION</span>
            <h1>Trust is documented, not implied</h1>
            <p>
              Clinoro separates category guidance, verified evidence and
              project-specific commercial commitments so buyers can see exactly
              what is—and is not—confirmed.
            </p>
          </div>
        </section>
        <section className="section">
          <div className="site-wrap">
            <div className="global-trust-standard">
              <article>
                <ClipboardIcon icon={<FileCheck2 />} number="01" />
                <h2>Defined scope</h2>
                <p>
                  Brand, model, configuration, services, exclusions and timeline
                  belong in the official project proposal.
                </p>
              </article>
              <article>
                <ClipboardIcon icon={<ShieldCheck />} number="02" />
                <h2>Evidence attached</h2>
                <p>
                  Final technical claims are accepted only against identifiable
                  manufacturer documentation for the selected model.
                </p>
              </article>
              <article>
                <ClipboardIcon icon={<CheckCircle2 />} number="03" />
                <h2>Measurable handover</h2>
                <p>
                  Acceptance tests, training and handover records are part of
                  project completion.
                </p>
              </article>
              <article>
                <ClipboardIcon icon={<Wrench />} number="04" />
                <h2>Lifecycle clarity</h2>
                <p>
                  Response time, PM, parts and escalation expectations are reviewed
                  before purchase.
                </p>
              </article>
            </div>
            <div className="global-trust-boundary">
              <LockKeyhole />
              <div>
                <b>Information boundary</b>
                <p>
                  Reference imagery, educational content and category guidance do
                  not confirm stock, representation, a specific model or a
                  commercial commitment.
                </p>
              </div>
            </div>
            {items.length ? (
              <div className="global-evidence-grid">
                {items.map((item) => (
                  <article key={item.id}>
                    {item.image && (
                      <span>
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          unoptimized
                        />
                      </span>
                    )}
                    <small>{item.type.toUpperCase()}</small>
                    <h2>{item.title}</h2>
                    <p>{item.description}</p>
                    {item.fileUrl && (
                      <a href={item.fileUrl} target="_blank" rel="noreferrer">
                        Review document
                      </a>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <div className="global-empty-evidence">
                <FileCheck2 />
                <h2>No public evidence item has been approved yet</h2>
                <p>
                  This empty state is intentional: no client, certificate, project
                  or document is published without owner verification.
                </p>
                <Link href="/en/contact">
                  Request official project information <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
    </EnglishShell>
  );
}

function ClipboardIcon({ icon, number }: { icon: ReactNode; number: string }) {
  return (
    <span>
      {icon}
      <small>{number}</small>
    </span>
  );
}
