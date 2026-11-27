import { serializeJsonLd } from "../../../lib/json-ld";
import { formatPersianDate, formatPersianNumber } from "../../../lib/persian-format";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpenText, CalendarDays, Clock3, ExternalLink, UserRound } from "lucide-react";
import { notFound } from "next/navigation";
import { PageShell } from "../../components";
import { getSiteContent } from "../../../lib/site-content";
import { InjectionLayer } from "../../injection-layer";
import { findPublishedBlogPost, getPublishedBlogPosts } from "../../../lib/blog";
import { relatedBlogPosts } from "../../../lib/content-discovery";
import { prepareBlogReferences } from "../../../lib/blog-references.mjs";

type BlogParams={params:Promise<{slug:string}>};

function readingMinutes(content:string){
  return Math.max(2,Math.ceil(content.trim().split(/\s+/).filter(Boolean).length/180));
}

function renderInline(text:string,key:string){
  const nodes:ReactNode[]=[];
  const pattern=/\[([^\]]+)\]\((\/[^)\s]+)\)/g;
  let cursor=0;
  for(const match of text.matchAll(pattern)){
    const index=match.index??0;
    if(index>cursor)nodes.push(text.slice(cursor,index));
    nodes.push(<Link href={match[2]} key={`${key}-${index}`}>{match[1]}</Link>);
    cursor=index+match[0].length;
  }
  if(cursor<text.length)nodes.push(text.slice(cursor));
  return nodes.length?nodes:text;
}

function renderArticle(content:string){
  const lines=content.split("\n").map(line=>line.trim());
  const nodes:ReactNode[]=[];
  for(let index=0;index<lines.length;index++){
    const line=lines[index];
    if(!line)continue;
    if(line.startsWith("## ")){nodes.push(<h2 id={`section-${index}`} key={`h-${index}`}>{line.slice(3)}</h2>);continue;}
    if(line.startsWith("### ")){nodes.push(<h3 key={`h3-${index}`}>{line.slice(4)}</h3>);continue;}
    if(line.startsWith("> ")){nodes.push(<blockquote key={`q-${index}`}>{renderInline(line.slice(2),`q-${index}`)}</blockquote>);continue;}
    if(line.startsWith("- ")){
      const items:string[]=[];
      while(index<lines.length&&lines[index].startsWith("- ")){items.push(lines[index].slice(2));index++;}
      index--;
      nodes.push(<ul key={`l-${index}`}>{items.map((item,itemIndex)=><li key={`${itemIndex}-${item}`}>{renderInline(item,`li-${index}-${itemIndex}`)}</li>)}</ul>);
      continue;
    }
    if(/^\d+\.\s/.test(line)){
      const items:string[]=[];
      while(index<lines.length&&/^\d+\.\s/.test(lines[index])){items.push(lines[index].replace(/^\d+\.\s/,""));index++;}
      index--;
      nodes.push(<ol key={`ol-${index}`}>{items.map((item,itemIndex)=><li key={`${itemIndex}-${item}`}>{renderInline(item,`ol-${index}-${itemIndex}`)}</li>)}</ol>);
      continue;
    }
    nodes.push(<p key={`p-${index}`}>{renderInline(line,`p-${index}`)}</p>);
  }
  return nodes;
}

export async function generateMetadata({params}:BlogParams):Promise<Metadata>{
  const {slug}=await params;
  const content=await getSiteContent();
  const post=findPublishedBlogPost(content.blogPosts,slug);
  if(!post)return {};
  const socialTitle=post.seoTitle||`${post.title} | Clinoro`;
  const title=socialTitle.replace(/\s*\|\s*Clinoro\s*$/i,"");
  return {title,description:post.seoDescription||post.excerpt,keywords:post.keywords,alternates:{canonical:`/blog/${post.slug}`},openGraph:{type:"article",title:socialTitle,description:post.seoDescription||post.excerpt,url:`/blog/${post.slug}`,publishedTime:post.publishedTime,authors:[post.author],images:[{url:post.image,alt:post.imageAlt||post.title}]},twitter:{card:"summary_large_image",title:socialTitle,description:post.seoDescription||post.excerpt,images:[post.image]}};
}

export default async function BlogPostPage({params}:BlogParams){
  const {slug}=await params;
  const content=await getSiteContent();
  const publishedPosts=getPublishedBlogPosts(content.blogPosts);
  const post=publishedPosts.find(item=>item.slug===slug);
  if(!post)notFound();
  const article=prepareBlogReferences(post.content,post.sources);
  const related=relatedBlogPosts(publishedPosts,[post.title,post.category,...(post.keywords||[])].join(" "),post.slug);
  const toc=article.content.split("\n").map((line,index)=>({line:line.trim(),index})).filter(item=>item.line.startsWith("## "));
  const breadcrumb={"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"خانه",item:"https://clinoromedical.com/"},{"@type":"ListItem",position:2,name:"راهنمای تجهیزات پزشکی",item:"https://clinoromedical.com/blog"},{"@type":"ListItem",position:3,name:post.title,item:`https://clinoromedical.com/blog/${post.slug}`}]};
  const articleSchema={"@context":"https://schema.org","@type":"Article",headline:post.title,description:post.excerpt,image:{"@type":"ImageObject",url:`https://clinoromedical.com${post.image}`,caption:post.imageAlt||post.title},datePublished:post.publishedTime,dateModified:post.publishedTime,inLanguage:"fa-IR",articleSection:post.category,keywords:post.keywords?.join(", "),author:{"@type":"Organization",name:post.author},publisher:{"@type":"Organization",name:"Clinoro",logo:{"@type":"ImageObject",url:"https://clinoromedical.com/assets/clinoro-mark-primary.png"}},mainEntityOfPage:`https://clinoromedical.com/blog/${post.slug}`};
  return <PageShell active="/blog"><main id="main-content" className="blog-post-page"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:serializeJsonLd(articleSchema)}}/>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:serializeJsonLd(breadcrumb)}}/><section className="blog-post-hero"><div className="blog-post-orbit"/><div className="site-wrap"><Link className="blog-back" href="/blog"><ArrowRight size={17}/> بازگشت به بلاگ</Link><div className="blog-post-heading"><span>{post.category}</span><h1>{post.title}</h1><p>{post.excerpt}</p><div><small><UserRound size={15}/><Link href="/about">{post.author}</Link></small><small><CalendarDays size={15}/><time dateTime={post.publishedTime}>{formatPersianDate(post.publishedTime)}</time></small><small><Clock3 size={15}/>{formatPersianNumber(readingMinutes(post.content))} دقیقه مطالعه</small></div></div><div className="blog-post-cover prism-edge"><Image src={post.image||"/assets/medical-visual.jpg"} alt={post.imageAlt||post.title} fill priority unoptimized sizes="(max-width:900px) 100vw,1100px"/><div className="blog-cover-scan"/></div>{post.imageCredit&&<a className="blog-image-credit" href={post.imageSource||undefined} target="_blank" rel="noreferrer">عکس: {post.imageCredit}{post.imageLicense?` · مجوز: ${post.imageLicense}`:""} <ExternalLink size={12}/></a>}</div></section>
    <div className="site-wrap blog-post-layout">
      <article className="blog-post-content"><p className="editorial-note">راهنمای خرید و بهره‌برداری؛ انتخاب بالینی و تعهد تأمین باید برای مدل و پروژهٔ مشخص بررسی شود. <Link href="/editorial-policy">روش تهیه، منابع و اصلاح مطالب</Link></p><div className="blog-article-body">{renderArticle(article.content)}</div>{!!article.sources.length&&<section className="blog-references" aria-labelledby="blog-references-title"><h2 id="blog-references-title">منابع و مراجع</h2><p>{article.sources.map((source,index)=><span className="blog-reference" key={source.url||source.title}>{index>0&&"؛ "}<span className="blog-reference-number">{(index+1).toLocaleString("fa-IR")}. </span>{source.url?<a href={source.url} target="_blank" rel="noopener noreferrer" dir="auto">{source.title}</a>:source.title}</span>)}.</p></section>}</article>
      <aside className="blog-post-aside"><div><BookOpenText size={20}/><b>در این مقاله</b><nav aria-label="فهرست بخش‌های مقاله"><ul>{toc.map(item=><li key={item.index}><a href={`#section-${item.index}`}>{item.line.slice(3)}</a></li>)}</ul></nav><span>{post.category}</span><span>{formatPersianNumber(readingMinutes(post.content))} دقیقه مطالعه کاربردی</span></div><Link href="/contact">برای پروژه خود مشاوره بگیرید <ArrowLeft size={16}/></Link></aside>
    </div>
    {!!related.length&&<section className="related-insights"><div className="site-wrap"><div className="related-head"><div><span className="eyebrow">KEEP EXPLORING</span><h2>مطالب مرتبط</h2></div><Link href="/blog">همه مطالب <ArrowLeft size={17}/></Link></div><div>{related.map(item=><Link className="related-card prism-edge" href={`/blog/${item.slug}`} key={item.id}><Image src={item.image} alt={item.imageAlt||item.title} fill unoptimized sizes="(max-width:700px) 100vw,33vw"/><span/><div><small>{item.category}</small><h3>{item.title}</h3><em>مطالعه مقاله <ArrowLeft size={15}/></em></div></Link>)}</div></div></section>}
    <InjectionLayer content={content} page="blog"/>
  </main></PageShell>;
}
