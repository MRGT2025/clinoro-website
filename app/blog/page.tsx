import { InnerHero } from "../inner-components";
import { getSiteContent } from "../../lib/site-content";
import { CustomContentBlocks } from "../custom-content";
import { InjectionLayer } from "../injection-layer";
import { BlogExplorer } from "./blog-explorer";
import { pageMetadata } from "../../lib/seo";
import { getBlogReadingMinutes, getPublishedBlogPosts } from "../../lib/blog";
export const generateMetadata=()=>pageMetadata("blog");

export default async function BlogPage(){
  const content=await getSiteContent();
  const posts=getPublishedBlogPosts(content.blogPosts);
  return <InnerHero active="/blog" {...content.pages.blog}>
    <section className="section blog-section"><div className="site-wrap">
      <div className="blog-toolbar"><div><span className="eyebrow">CLINORO INSIGHTS</span><h2>تازه‌ترین مطالب</h2></div><p>{posts.length.toLocaleString("fa-IR")} مطلب منتشرشده</p></div>
      {posts.length?<BlogExplorer posts={posts.map(post=>({id:post.id,slug:post.slug,title:post.title,excerpt:post.excerpt,image:post.image,category:post.category,author:post.author,publishedAt:post.publishedAt,publishedTime:post.publishedTime,published:post.published,seoTitle:post.seoTitle,seoDescription:post.seoDescription,imageCredit:post.imageCredit,imageSource:post.imageSource,imageAlt:post.imageAlt,imageLicense:post.imageLicense,readingMinutes:getBlogReadingMinutes(post.content)}))}/>:<div className="blog-empty"><h2>هنوز مطلبی منتشر نشده است</h2><p>نوشته‌های جدید از پنل مدیریت در این صفحه نمایش داده می‌شوند.</p></div>}
    </div></section>
    <CustomContentBlocks blocks={content.customBlocks.blog}/>
    <InjectionLayer content={content} page="blog"/>
  </InnerHero>;
}
