import type { Metadata } from "next";
import { getSiteContent } from "../../../lib/site-content";
import { EnglishShell } from "../en-shell";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms governing use of Clinoro website content, equipment information and RFQ services.",
  alternates: {
    canonical: "/en/terms",
    languages: {
      "fa-IR": "/terms",
      en: "/en/terms",
      "x-default": "/en/terms",
    },
  },
  openGraph: {
    title: "Terms of Use | Clinoro",
    description:
      "Terms governing Clinoro website content, equipment information and RFQ services.",
    url: "/en/terms",
    locale: "en_US",
    type: "website",
  },
};

export default async function EnglishTermsPage() {
  const content = await getSiteContent();
  return (
    <EnglishShell content={content} active="">
      <main id="main-content" className="legal-page global-legal">
        <section className="site-wrap">
          <span className="hero-kicker">TERMS OF USE</span>
          <h1>Terms of use</h1>
          <p className="legal-lead">Last updated: August 13, 2026</p>
          <article>
            <h2>Purpose of the website</h2>
            <p>
              Clinoro content introduces capabilities, equipment categories and
              services and supports technical and commercial enquiries. Website
              content alone is not a binding offer, prescription or clinical
              recommendation.
            </p>
            <h2>Equipment information</h2>
            <p>
              Model, specification, availability, lead time and service scope may
              vary by manufacturer, market and project. Final information is valid
              only when stated in the official proposal and documents accepted by
              the parties.
            </p>
            <h2>RFQs and communication</h2>
            <p>
              Sending a form or email does not constitute order acceptance or create
              a contractual commitment. Technical and commercial terms are provided
              after the requirement has been reviewed.
            </p>
            <h2>Content ownership</h2>
            <p>
              Original text, structure and brand elements belong to Clinoro or
              their authorized owners. Sourced or licensed images remain subject to
              the terms of their credited source and rights holder.
            </p>
            <h2>Responsible use</h2>
            <p>
              Equipment purchase, installation and clinical-use decisions must be
              made by qualified people under local requirements, manufacturer
              instructions and an appropriate technical assessment.
            </p>
            <h2>Contact</h2>
            <p>
              Questions about these terms can be sent to{" "}
              <a href={`mailto:${content.general.email}`}>{content.general.email}</a>.
            </p>
          </article>
        </section>
      </main>
    </EnglishShell>
  );
}
