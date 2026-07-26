import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpenText, CalendarDays, Clock3, ExternalLink, UserRound } from "lucide-react";
import { notFound } from "next/navigation";
import { PageShell } from "../../components";
import { getSiteContent } from "../../../lib/site-content";
import { InjectionLayer } from "../../injection-layer";

type BlogParams={params:Promise<{slug:string}>};

function readingMinutes(content:string){
  return Math.max(2,Math.ceil(content.trim().split(/\s+/).filter(Boolean).length/180));
}

function renderArticle(content:string){
  const lines=content.split("\n").map(line=>line.trim());
  const nodes:ReactNode[]=[];
  for(let index=0;index<lines.length;index++){
    const line=lines[index];
    if(!line)continue;
    if(line.startsWith("## ")){nodes.push(<h2 key={`h-${index}`}>{line.slice(3)}</h2>);continue;}
    if(line.startsWith("### ")){nodes.push(<h3 key={`h3-${index}`}>{line.slice(4)}</h3>);continue;}
    if(line.startsWith("> ")){nodes.push(<blockquote key={`q-${index}`}>{line.slice(2)}</blockquote>);continue;}
    if(line.startsWith("- ")){
      const items:string[]=[];
      while(index<lines.length&&lines[index].startsWith("- ")){items.push(lines[index].slice(2));index++;}
      index--;
      nodes.push(<ul key={`l-${index}`}>{items.map((item,itemIndex)=><li key={`${itemIndex}-${item}`}>{item}</li>)}</ul>);
      continue;
    }
    if(/^\d+\.\s/.test(line)){
      const items:string[]=[];
      while(index<lines.length&&/^\d+\.\s/.test(lines[index])){items.push(lines[index].replace(/^\d+\.\s/,""));index++;}
      index--;
      nodes.push(<ol key={`ol-${index}`}>{items.map((item,itemIndex)=><li key={`${itemIndex}-${item}`}>{item}</li>)}</ol>);
      continue;
    }
    nodes.push(<p key={`p-${index}`}>{line}</p>);
  }
  return nodes;
}

export async function generateMetadata({params}:BlogParams):Promise<Metadata>{
  const {slug}=await params;
  const content=await getSiteContent();
  const post=content.blogPosts.find(item=>item.slug===slug&&item.published);
  return post?{title:post.seoTitle||post.title,description:post.seoDescription||post.excerpt,alternates:{canonical:`/blog/${post.slug}`},openGraph:{type:"article",title:post.seoTitle||post.title,description:post.seoDescription||post.excerpt,url:`/blog/${post.slug}`,publishedTime:`${post.publishedAt}T00:00:00Z`,authors:[post.author],images:[{url:post.image,alt:post.title}]},twitter:{card:"summary_large_image",title:post.seoTitle||post.title,description:post.seoDescription||post.excerpt,images:[post.image]}}:{};
}

export default async function BlogPostPage({params}:BlogParams){
  const {slug}=await params;
  const content=await getSiteContent();
  const post=content.blogPosts.find(item=>item.slug===slug&&item.published);
  if(!post)notFound();
  const related=content.blogPosts.filter(item=>item.published&&item.id!==post.id).sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt)).slice(0,3);
  const articleSchema={"@context":"https://schema.org","@type":"Article",headline:post.title,description:post.excerpt,image:`https://clinoromedical.com${post.image}`,datePublished:post.publishedAt,author:{"@type":"Organization",name:post.author},publisher:{"@type":"Organization",name:"Clinoro",logo:{"@type":"ImageObject",url:"https://clinoromedical.com/assets/clinoro-mark-minimal-grey.png"}},mainEntityOfPage:`https://clinoromedical.com/blog/${post.slug}`};
  return <PageShell active="/blog"><main id="main-content" className="blog-post-page"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(articleSchema)}}/>
    <section className="blog-post-hero"><div className="blog-post-orbit"/><div className="site-wrap"><Link className="blog-back" href="/blog"><ArrowRight size={17}/> بازگشت به بلاگ</Link><div className="blog-post-heading"><span>{post.category}</span><h1>{post.title}</h1><p>{post.excerpt}</p><div><small><UserRound size={15}/>{post.author}</small><small><CalendarDays size={15}/>{new Date(post.publishedAt).toLocaleDateString("fa-IR")}</small><small><Clock3 size={15}/>{readingMinutes(post.content).toLocaleString("fa-IR")} دقیقه مطالعه</small></div></div><div className="blog-post-cover prism-edge"><Image src={post.image||"/assets/medical-visual.jpg"} alt={post.title} fill priority unoptimized sizes="(max-width:900px) 100vw,1100px"/><div className="blog-cover-scan"/></div>{post.imageCredit&&<a className="blog-image-credit" href={post.imageSource||undefined} target="_blank" rel="noreferrer">عکس: {post.imageCredit} <ExternalLink size={12}/></a>}</div></section>
    <div className="site-wrap blog-post-layout">
      <article className="blog-post-content">{renderArticle(post.content)}</article>
      <aside className="blog-post-aside"><div><BookOpenText size={20}/><b>در این مقاله</b><span>{post.category}</span><span>{readingMinutes(post.content).toLocaleString("fa-IR")} دقیقه مطالعه کاربردی</span></div><Link href="/contact">برای پروژه خود مشاوره بگیرید <ArrowLeft size={16}/></Link></aside>
    </div>
    {!!post.sources.length&&<section className="article-sources"><div className="site-wrap"><div className="article-sources-head"><span className="eyebrow">VERIFIED REFERENCES</span><h2>منابع و مطالعه بیشتر</h2></div><div>{post.sources.map(source=><a className="source-card prism-edge" href={source.url} target="_blank" rel="noreferrer" key={source.url}><span><ExternalLink size={17}/></span><b>{source.title}</b><small>مشاهده منبع اصلی</small></a>)}</div></div></section>}
    {!!related.length&&<section className="related-insights"><div className="site-wrap"><div className="related-head"><div><span className="eyebrow">KEEP EXPLORING</span><h2>مطالب مرتبط</h2></div><Link href="/blog">همه مطالب <ArrowLeft size={17}/></Link></div><div>{related.map(item=><Link className="related-card prism-edge" href={`/blog/${item.slug}`} key={item.id}><Image src={item.image} alt="" fill unoptimized sizes="(max-width:700px) 100vw,33vw"/><span/><div><small>{item.category}</small><h3>{item.title}</h3><em>مطالعه مقاله <ArrowLeft size={15}/></em></div></Link>)}</div></div></section>}
    <InjectionLayer content={content} page="blog"/>
  </main></PageShell>;
}
