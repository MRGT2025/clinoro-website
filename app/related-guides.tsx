import Link from "next/link";
import { relatedBlogPosts } from "../lib/content-discovery";
import type { BlogPost } from "../lib/site-content";

export function RelatedGuides({ posts, subject }: { posts: BlogPost[]; subject: string }) {
  const guides = relatedBlogPosts(posts,subject);
  if (!guides.length) return null;
  return <section className="section seo-guides"><div className="site-wrap"><h2>راهنماهای خرید و بهره‌برداری مرتبط</h2><p>پیش از استعلام، معیارهای انتخاب، مدارک و آزمون‌های تحویل این گروه را بررسی کنید.</p><ul>{guides.map(post=><li key={post.slug}><Link href={`/blog/${post.slug}`}>{post.title}</Link></li>)}</ul><Link href="/procurement">آماده‌سازی درخواست تأمین تجهیزات</Link></div></section>;
}
