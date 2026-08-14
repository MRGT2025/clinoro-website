import type { Metadata } from "next";
import { getSiteContent } from "../../../lib/site-content";
import { EnglishShell } from "../en-shell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Clinoro collects, uses, protects and responds to requests about RFQ form data.",
  alternates: {
    canonical: "/en/privacy",
    languages: {
      "fa-IR": "/privacy",
      en: "/en/privacy",
      "x-default": "/en/privacy",
    },
  },
  openGraph: {
    title: "Privacy Policy | Clinoro",
    description: "How Clinoro handles information submitted through RFQ forms.",
    url: "/en/privacy",
    locale: "en_US",
    type: "website",
  },
};

export default async function EnglishPrivacyPage() {
  const content = await getSiteContent();
  return (
    <EnglishShell content={content} active="">
      <main id="main-content" className="legal-page global-legal">
        <section className="site-wrap">
          <span className="hero-kicker">PRIVACY</span>
          <h1>Privacy policy</h1>
          <p className="legal-lead">Last updated: July 22, 2026</p>
          <article>
            <h2>Information we collect</h2>
            <p>
              Clinoro stores the information you submit in an RFQ, including your
              name, contact details, organization, location, related equipment and
              requirement description, together with a tracking reference.
            </p>
            <h2>How the information is used</h2>
            <p>
              This information is used to review the request, contact you and
              prepare a relevant technical or commercial response. It is not sold
              or shared with third parties for unrelated advertising.
            </p>
            <h2>Storage and access</h2>
            <p>
              Requests are stored in the Clinoro system. Only authorized Clinoro
              administrators can access the RFQ inbox; administrator access can be
              revoked and secondary-admin management is restricted to the owner.
            </p>
            <h2>Access, correction or deletion</h2>
            <p>
              To request access to, correction of or deletion of your information,
              email <a href={`mailto:${content.general.email}`}>{content.general.email}</a>
              {" "}and include your form tracking reference.
            </p>
            <h2>Security boundary</h2>
            <p>
              Access controls, input validation and submission rate limits are used
              to reduce misuse. No internet-based system can guarantee absolute
              security.
            </p>
          </article>
        </section>
      </main>
    </EnglishShell>
  );
}
