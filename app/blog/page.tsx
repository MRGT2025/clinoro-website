import { InnerHero } from "../inner-components";
import { getSiteContent } from "../../lib/site-content";
import { CustomContentBlocks } from "../custom-content";
import { InjectionLayer } from "../injection-layer";
import { BlogExplorer } from "./blog-explorer";
import { pageMetadata } from "../../lib/seo";
export const generateMetadata=()=>pageMetadata("blog");

export default async function BlogPage(){
  const content=await getSiteContent();
  const posts=content.blogPosts.filter(post=>post.published).sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt));
  return <InnerHero active="/blog" {...content.pages.blog}>
    <section className="section blog-section"><div className="site-wrap">
      <div className="blog-toolbar"><div><span className="eyebrow">CLINORO INSIGHTS</span><h2>تازه‌ترین مطالب</h2></div><p>{posts.length.toLocaleString("fa-IR")} مطلب منتشرشده</p></div>
      {posts.length?<BlogExplorer posts={posts}/>:<div className="blog-empty"><h2>هنوز مطلبی منتشر نشده است</h2><p>نوشته‌های جدید از پنل مدیریت در این صفحه نمایش داده می‌شوند.</p></div>}
    </div></section>
    <CustomContentBlocks blocks={content.customBlocks.blog}/>
    <InjectionLayer content={content} page="blog"/>
  </InnerHero>;
}
