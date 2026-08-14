import type { Metadata } from "next";
import "@fontsource/vazirmatn/300.css";
import "@fontsource/vazirmatn/400.css";
import "@fontsource/vazirmatn/500.css";
import "@fontsource/vazirmatn/600.css";
import "@fontsource/vazirmatn/700.css";
import "@fontsource/vazirmatn/800.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "@fontsource/manrope/800.css";
import "@fontsource/estedad/400.css";
import "@fontsource/estedad/600.css";
import "@fontsource/estedad/700.css";
import "@fontsource/noto-sans-arabic/400.css";
import "@fontsource/noto-sans-arabic/600.css";
import "@fontsource/noto-sans-arabic/700.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/700.css";
import "./globals.css";
import { getSiteContent } from "../lib/site-content";
import { SiteContentProvider } from "./content-context";
import { BrandIntro } from "./brand-intro";
import type { CSSProperties } from "react";

export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    metadataBase: new URL("https://clinoromedical.com"),
    title: { default: content.general.metaTitle, template: "%s | Clinoro" },
    description: content.general.metaDescription,
    applicationName: "Clinoro Medical Technologies",
    authors: [{ name: "Clinoro" }],
    creator: "Clinoro",
    publisher: "Clinoro",
    keywords: [
      "تجهیزات پزشکی",
      "خرید تجهیزات پزشکی",
      "تأمین تجهیزات بیمارستانی",
      "مشاوره تجهیزات پزشکی",
      "نصب و نگهداری تجهیزات پزشکی",
      "Clinoro",
    ],
    category: "Medical equipment and healthcare technology",
    other: { "clinoro-deployment": "clinoro-95-20260814" },
    formatDetection: { email: false, address: false, telephone: false },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "fa_IR",
      siteName: "Clinoro Medical Technologies",
      title: content.general.metaTitle,
      description: content.general.metaDescription,
      url: "/",
      images: [
        { url: content.home.heroImage, alt: "Clinoro Medical Technologies" },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: content.general.metaTitle,
      description: content.general.metaDescription,
      images: [content.home.heroImage],
    },
    manifest: "/manifest.webmanifest",
    icons: {
      icon: "/assets/clinoro-app-icon.png",
      shortcut: "/assets/clinoro-app-icon.png",
      apple: "/assets/clinoro-app-icon.png",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const content = await getSiteContent();
  const design = content.design;
  const faFonts = {
    vazirmatn: '"Vazirmatn",Tahoma,sans-serif',
    estedad: '"Estedad","Vazirmatn",Tahoma,sans-serif',
    noto: '"Noto Sans Arabic","Vazirmatn",Tahoma,sans-serif',
  } as const;
  const enFonts = {
    manrope: '"Manrope",Arial,sans-serif',
    inter: '"Inter","Manrope",Arial,sans-serif',
  } as const;
  const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
  const designStyle = {
    "--ink": design.colors.ink,
    "--ink2": design.colors.ink2,
    "--cobalt": design.colors.cobalt,
    "--blue": design.colors.blue,
    "--teal": design.colors.teal,
    "--cyan": design.colors.cyan,
    "--silver": design.colors.silver,
    "--pearl": design.colors.surface,
    "--muted": design.colors.muted,
    "--container-max": `${clamp(design.containerWidth, 1080, 1600)}px`,
    "--section-space": `${clamp(design.sectionSpacing, 68, 160)}px`,
    "--radius-scale": clamp(design.radiusScale, 0.7, 1.45),
    "--content-grid-columns": clamp(design.gridColumns, 8, 16),
    "--content-grid-gap": `${clamp(design.gridGap, 8, 48)}px`,
    "--base-font-size": `${clamp(design.baseFontSize, 14, 20)}px`,
    "--heading-scale": clamp(design.headingScale, 0.82, 1.25),
    "--glass-blur": `${clamp(design.glassBlur, 8, 42)}px`,
    "--shadow-depth": clamp(design.shadowDepth, 0.5, 1.8),
    "--motion-intensity": clamp(design.motionIntensity, 0.35, 1.5),
    "--font-fa": faFonts[design.faFont] || faFonts.vazirmatn,
    "--font-en": enFonts[design.enFont] || enFonts.manrope,
  } as CSSProperties;
  const clientContent = {
    ...content,
    blogPosts: content.blogPosts.map((post) => ({
      ...post,
      content: "",
      sources: [],
    })),
  };
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Clinoro Medical Technologies",
    alternateName: content.general.brand,
    url: "https://clinoromedical.com",
    logo: "https://clinoromedical.com/assets/clinoro-mark-primary.png",
    email: content.general.email,
    telephone: content.general.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: content.general.address,
      addressCountry: "IR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales and technical enquiries",
      telephone: content.general.phone,
      email: content.general.email,
      availableLanguage: ["fa", "en"],
    },
  };
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Clinoro Medical Technologies",
    alternateName: "Clinoro",
    url: "https://clinoromedical.com/",
    inLanguage: "fa-IR",
    publisher: {
      "@type": "Organization",
      name: "Clinoro Medical Technologies",
      url: "https://clinoromedical.com/",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://clinoromedical.com/products?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
  const introState = `try{if(sessionStorage.getItem("clinoro-brand-intro-v1")==="seen"||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.clinoroIntro="seen"}catch{}`;
  return (
    <html
      lang="fa"
      dir="rtl"
      suppressHydrationWarning
      style={designStyle}
      data-theme-preset={design.preset}
      data-header-style={design.headerStyle}
      data-card-style={design.cardStyle}
      data-density={design.density}
      data-background-style={design.backgroundStyle}
      data-button-style={design.buttonStyle}
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: introState }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
        />
        <BrandIntro motionMode={content.general.motionMode} />
        <SiteContentProvider content={clientContent}>
          {children}
        </SiteContentProvider>
      </body>
    </html>
  );
}
