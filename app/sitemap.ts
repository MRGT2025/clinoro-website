import type { MetadataRoute } from "next";
import { categoryPath } from "../lib/catalog";
import { categoryHasProducts } from "../lib/content-discovery";
import { getSiteContent } from "../lib/site-content";
import { getPublishedBlogPosts } from "../lib/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getSiteContent();
  const base = "https://clinoromedical.com";
  const paths = ["/","/products","/services","/solutions","/procurement","/blog","/about","/contact","/credentials","/privacy","/terms","/editorial-policy",
    ...(content.international.enabled ? ["/en","/en/products","/en/contact","/en/credentials","/en/privacy","/en/terms"] : [])];
  const fixed: MetadataRoute.Sitemap = paths.map(path => ({url:base+path}));
  const categories = content.productCategories
    .filter(category => category.id.trim() && categoryHasProducts(category,content.productCategories,content.products))
    .flatMap(category => [{url:base+categoryPath(category.id)},...(content.international.enabled ? [{url:base+categoryPath(category.id,"en")}] : [])]);
  const products = content.products.filter(product=>product.slug.trim()).flatMap(product => [
    {url:`${base}/products/${product.slug}`},
    ...(content.international.enabled ? [{url:`${base}/en/products/${product.slug}`}] : []),
  ]);
  const posts = getPublishedBlogPosts(content.blogPosts).map(post=>({url:`${base}/blog/${post.slug}`,lastModified:post.publishedTime}));
  return [...new Map([...fixed,...categories,...products,...posts].map(item=>[item.url,item])).values()];
}
