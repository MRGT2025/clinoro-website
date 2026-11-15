import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import { InnerHero } from "../../../inner-components";
import {
  categoryImage,
  categoryPath,
  childCategories,
  productsForCategoryPage,
} from "../../../../lib/catalog";
import { getSiteContent, type ProductItem } from "../../../../lib/site-content";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const content = await getSiteContent();
  const category = content.productCategories.find((item) => item.id === slug);
  if (!category) return { title: "گروه پیدا نشد" };
  const path = categoryPath(category.id);
  const description = category.summary || category.fa;
  const image = categoryImage(category, content.productCategories, content.products);
  return {
    title: category.fa,
    description,
    alternates: {
      canonical: path,
      languages: { "fa-IR": path, en: categoryPath(category.id, "en") },
    },
    openGraph: {
      title: `${category.fa} | Clinoro`,
      description,
      url: path,
      type: "website",
      images: [{ url: image, alt: category.fa }],
    },
    twitter: { card: "summary_large_image", title: `${category.fa} | Clinoro`, description, images: [image] },
  };
}

export default async function ProductCategoryPage({ params }: Params) {
  const { slug } = await params;
  const content = await getSiteContent();
  const category = content.productCategories.find((item) => item.id === slug);
  if (!category) notFound();
  const parent = content.productCategories.find((item) => item.id === category.parentId);
  const children = childCategories(content.productCategories, category.id);
  const products = productsForCategoryPage(content.products, content.productCategories, category.id);
  const hub = children.length > 0;
  const image = categoryImage(category, content.productCategories, content.products);
  const listItems = hub
    ? children.map((child, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: child.fa,
        url: `https://clinoromedical.com${categoryPath(child.id)}`,
      }))
    : products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: product.fa,
        url: `https://clinoromedical.com/products/${product.slug}`,
      }));
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: category.fa,
    itemListElement: listItems,
  };
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "خانه", item: "https://clinoromedical.com/" },
      { "@type": "ListItem", position: 2, name: "محصولات", item: "https://clinoromedical.com/products" },
      ...(parent
        ? [{ "@type": "ListItem", position: 3, name: parent.fa, item: `https://clinoromedical.com${categoryPath(parent.id)}` }]
        : []),
      {
        "@type": "ListItem",
        position: parent ? 4 : 3,
        name: category.fa,
        item: `https://clinoromedical.com${categoryPath(category.id)}`,
      },
    ],
  };

  return (
    <InnerHero active="/products" eyebrow={category.en} title={category.fa} text={category.summary || category.en} image={image} note={category.en}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <section className="section products-section">
        <div className="site-wrap">
          <div className="catalog-subnav">
            <Link href="/products">همه محصولات</Link>
            {parent && <Link href={categoryPath(parent.id)}>{parent.fa}</Link>}
          </div>
          {hub && (
            <div className="catalog-family">
              {children.map((child) => {
                const count = productsForCategoryPage(content.products, content.productCategories, child.id).length;
                return (
                  <Link href={categoryPath(child.id)} key={child.id}>
                    <span>
                      <Image src={categoryImage(child, content.productCategories, content.products)} alt="" fill unoptimized sizes="(max-width:700px) 100vw,240px" />
                    </span>
                    <div>
                      <small>{child.en}</small>
                      <h2>{child.fa}</h2>
                      <p>{child.summary}</p>
                      <em>
                        {count ? `${count.toLocaleString("fa-IR")} محصول` : "صفحه زیرگروه"} <ArrowLeft size={15} />
                      </em>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
          {products.length > 0 && (
            <div className="product-grid">
              {products.map((product) => (
                <CatalogCard product={product} key={product.slug} />
              ))}
            </div>
          )}
          {!hub && products.length === 0 && (
            <div className="empty-state">
              <h2>هنوز محصولی در این زیرگروه منتشر نشده است</h2>
              <p>محصول‌های این گروه پس از انتشار اینجا دیده می‌شوند.</p>
              <Link href="/contact">درخواست این گروه <ArrowLeft size={16} /></Link>
            </div>
          )}
          {!hub && products.length > 0 && parent && (
            <p className="catalog-parent-link">
              <ChevronLeft size={14} />
              <Link href={categoryPath(parent.id)}>بازگشت به {parent.fa}</Link>
            </p>
          )}
        </div>
      </section>
    </InnerHero>
  );
}

function CatalogCard({ product }: { product: ProductItem }) {
  return (
    <article className="product-card">
      <Link className="product-image" href={`/products/${product.slug}`} aria-label={`مشاهده ${product.fa}`}>
        <Image src={product.image} alt={`تصویر مرجع ${product.fa}`} fill unoptimized sizes="(max-width:700px) 100vw,33vw" />
        {product.tag && <span>{product.tag}</span>}
      </Link>
      <div className="product-body">
        {product.en && <small>{product.en}</small>}
        <h2>{product.fa}</h2>
        {product.summary && <p>{product.summary}</p>}
        <div className="product-card-actions single">
          <Link href={`/products/${product.slug}`}>
            مشخصات محصول <ArrowLeft size={17} />
          </Link>
        </div>
      </div>
    </article>
  );
}
