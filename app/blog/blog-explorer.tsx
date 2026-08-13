import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock3, SlidersHorizontal } from "lucide-react";
import type { BlogPost } from "../../lib/site-content";

type BlogCardPost=Omit<BlogPost,"content"|"sources">&{publishedTime:string;readingMinutes:number};

function formatDate(value:string){
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian",{year:"numeric",month:"numeric",day:"numeric",timeZone:"Asia/Dubai"}).format(new Date(value));
}

export function BlogExplorer({posts}:{posts:BlogCardPost[]}){
  const categories=["همه مطالب",...Array.from(new Set(posts.map(post=>post.category)))];

  return <>
    <div className="blog-filter-shell glass-panel prism-edge">
      <span><SlidersHorizontal size={16}/> موضوعات منتشرشده</span>
      <div>{categories.map((item,index)=><span className={`blog-filter-chip${index===0?" active":""}`} key={item}>{item}</span>)}</div>
    </div>
    <div className="blog-grid">{posts.map((post,index)=><article className={`blog-card prism-edge${index===0?" featured":""}`} key={post.id}>
      <Link className="blog-card-image" href={`/blog/${post.slug}`}><Image src={post.image||"/assets/medical-visual.jpg"} alt={post.imageAlt||post.title} fill unoptimized priority={index<2} sizes="(max-width:800px) 100vw,50vw"/></Link>
      <div className="blog-card-copy"><span>{post.category}</span><h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2><p>{post.excerpt}</p><div><small><CalendarDays size={14}/>{formatDate(post.publishedTime)}</small><small><Clock3 size={14}/>{post.readingMinutes.toLocaleString("fa-IR")} دقیقه مطالعه</small></div><Link className="text-link" href={`/blog/${post.slug}`}>ادامه مطلب <ArrowLeft size={17}/></Link></div>
    </article>)}</div>
  </>;
}
