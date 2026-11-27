import { serializeJsonLd } from "../../../../../lib/json-ld";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import {
  categoryImage,
  categoryPath,
  childCategories,
  productsForCategoryPage,
} from "../../../../../lib/catalog";
import { categoryHasProducts } from "../../../../../lib/content-discovery";
import { getSiteContent } from "../../../../../lib/site-content";
import { EnglishShell } from "../../../en-shell";
import { optimizedAssetUrl } from "../../../../../lib/assets";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const content = await getSiteContent();
  const category = content.productCategories.find((item) => item.id === slug);
  if (!category) return { title: "Category not found" };
  const path = categoryPath(category.id, "en");
  const description = category.summaryEn || category.en;
  const image = categoryImage(category, content.productCategories, content.products);
  return {
    title: category.en,
    description,
    robots: { index: categoryHasProducts(category,content.productCategories,content.products), follow: true },
    alternates: {
      canonical: path,
      languages: {
        "fa-IR": categoryPath(category.id),
        en: path,
        "x-default": path,
      },
    },
    openGraph: {
      title: `${category.en} | Clinoro`,
      description,
      url: path,
      locale: "en_US",
      type: "website",
      images: [{ url: image, alt: category.en }],
    },
    twitter: { card: "summary_large_image", title: `${category.en} | Clinoro`, description, images: [image] },
  };
}

export default async function EnglishProductCategoryPage({ params }: Params) {
  const { slug } = await params;
  const content = await getSiteContent();
  const category = content.productCategories.find((item) => item.id === slug);
  if (!category) notFound();
  const parent = content.productCategories.find((item) => item.id === category.parentId);
  const children = childCategories(content.productCategories, category.id);
  const products = productsForCategoryPage(content.products, content.productCategories, category.id);
  const hub = children.length > 0;
  const list = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    inLanguage: "en",
    name: category.en,
    itemListElement: hub
      ? children.map((child, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: child.en,
          url: `https://clinoromedical.com${categoryPath(child.id, "en")}`,
        }))
      : products.map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: product.en,
          url: `https://clinoromedical.com/en/products/${product.slug}`,
        })),
  };

  return (
    <EnglishShell content={content} active="/en/products">
      <main id="main-content" className="global-products">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(list) }} />
        <section className="global-inner-hero">
          <div className="site-wrap">
            <span>{parent ? parent.en.toUpperCase() : "PRODUCT CATEGORY"}</span>
            <h1>{category.en}</h1>
            <p>{category.summaryEn || category.summary}</p>
            <nav className="global-category-nav" aria-label="Category path">
              <Link href="/en/products">All equipment</Link>
              {parent && <Link href={categoryPath(parent.id, "en")}>{parent.en}</Link>}
              <Link href={categoryPath(category.id)}>فارسی</Link>
            </nav>
          </div>
        </section>
        <section className="section">
          <div className="site-wrap">
            {hub && (
              <div className="global-family">
                {children.map((child) => (
                  <Link href={categoryPath(child.id, "en")} key={child.id}>
                    <span>
                      <Image src={optimizedAssetUrl(categoryImage(child, content.productCategories, content.products))} alt="" fill unoptimized sizes="(max-width:700px) 100vw,25vw" />
                    </span>
                    <small>{child.en}</small>
                    <h2>{child.fa}</h2>
                    <p>{child.summaryEn}</p>
                    <em>
                      Open page <ArrowRight size={14} />
                    </em>
                  </Link>
                ))}
              </div>
            )}
            {products.length > 0 && (
              <div className="global-product-grid">
                {products.map((product) => (
                  <article key={product.slug}>
                    <Link href={`/en/products/${product.slug}`} className="global-product-image">
                      <Image src={optimizedAssetUrl(product.image)} alt={`Reference image for ${product.en}`} fill unoptimized sizes="(max-width:700px) 100vw,33vw" />
                      {product.tag && <span>{product.tag}</span>}
                    </Link>
                    <div>
                      <h2>{product.en}</h2>
                      <p>{product.international.summary}</p>
                      <Link href={`/en/products/${product.slug}`}>
                        Open product <ArrowRight size={16} />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
            {!hub && products.length === 0 && (
              <div className="global-empty-evidence">
                <h2>No products in this subgroup yet</h2>
                <p>Products published into this subgroup from the editor appear on this page.</p>
                <Link href="/en/contact">
                  Ask about this range <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
    </EnglishShell>
  );
}
