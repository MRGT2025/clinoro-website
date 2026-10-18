"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, ChevronDown, Clock3, Search, X } from "lucide-react";
import { useId, useMemo, useRef, useState } from "react";
import type { BlogPost } from "../../lib/site-content";
import { blogTopics, filterBlogPosts, matchesBlogTopic, suggestBlogSearch } from "../../lib/blog-search.mjs";

type BlogCardPost=Omit<BlogPost,"content"|"sources">&{publishedTime:string;readingMinutes:number};

function formatDate(value:string){
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian",{year:"numeric",month:"numeric",day:"numeric",timeZone:"Asia/Dubai"}).format(new Date(value));
}

export function BlogExplorer({posts}:{posts:BlogCardPost[]}){
  const [query,setQuery]=useState("");
  const [topic,setTopic]=useState("all");
  const [focused,setFocused]=useState(false);
  const [active,setActive]=useState(-1);
  const input=useRef<HTMLInputElement>(null);
  const listId=useId();
  const shown=useMemo(()=>filterBlogPosts(posts,query,topic),[posts,query,topic]);
  const suggestions=useMemo(()=>suggestBlogSearch(posts,query,topic),[posts,query,topic]);
  const topics=useMemo(()=>blogTopics.filter(item=>item.id==="all"||posts.some(post=>matchesBlogTopic(post,item.id))),[posts]);
  const expanded=focused&&suggestions.length>0;
  const filtered=Boolean(query.trim()||topic!=="all");
  const choose=(value:string)=>{setQuery(value);setActive(-1);setFocused(false);};
  const reset=()=>{setQuery("");setTopic("all");setActive(-1);input.current?.focus();};

  return <>
    <div className="blog-search-tools">
      <div className="blog-search-field" onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node|null)){setFocused(false);setActive(-1);}}}>
        <Search size={19} aria-hidden="true"/>
        <input ref={input} className="blog-search-input" type="search" role="combobox" aria-label="جست‌وجو در مقاله‌ها" aria-autocomplete="list" aria-expanded={expanded} aria-controls={expanded?listId:undefined} aria-activedescendant={expanded&&active>=0?`${listId}-${active}`:undefined} autoComplete="off" placeholder="جست‌وجوی مقاله یا کلیدواژه…" value={query}
          onFocus={()=>setFocused(true)} onChange={event=>{setQuery(event.target.value);setActive(-1);setFocused(true);}}
          onKeyDown={event=>{
            if(event.nativeEvent.isComposing)return;
            if(event.key==="Escape"){event.preventDefault();setFocused(false);setActive(-1);}
            if((event.key==="ArrowDown"||event.key==="ArrowUp")&&suggestions.length){event.preventDefault();setFocused(true);setActive(current=>event.key==="ArrowDown"?(current+1)%suggestions.length:(current<=0?suggestions.length-1:current-1));}
            if(event.key==="Enter"){event.preventDefault();if(expanded&&active>=0)choose(suggestions[active].value);else setFocused(false);}
          }}/>
        {query&&<button type="button" className="blog-search-clear" aria-label="پاک کردن جست‌وجو" onClick={()=>{setQuery("");setActive(-1);input.current?.focus();}}><X size={17}/></button>}
        {expanded&&<ul className="blog-search-suggestions" id={listId} role="listbox" aria-label="پیشنهادهای جست‌وجو">{suggestions.map((item,index)=><li key={item.id} role="option" id={`${listId}-${index}`} aria-selected={active===index} onMouseDown={event=>event.preventDefault()} onMouseEnter={()=>setActive(index)} onClick={()=>choose(item.value)}><Search size={15} aria-hidden="true"/><span>{item.value}</span><small>{item.label}</small></li>)}</ul>}
      </div>
      <div className="blog-topic-select"><select aria-label="فیلتر موضوع مقاله‌ها" value={topic} onChange={event=>{setTopic(event.target.value);setActive(-1);setFocused(false);}}>{topics.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}</select><ChevronDown size={16} aria-hidden="true"/></div>
    </div>
    <div className="blog-search-status" role="status" aria-live="polite">{filtered&&<><span>{shown.length.toLocaleString("fa-IR")} مقاله</span><button type="button" onClick={reset}>نمایش همه</button></>}</div>
    {!shown.length&&<div className="blog-search-empty"><Search size={28} aria-hidden="true"/><h3>مقاله‌ای پیدا نشد</h3><p>عبارت کوتاه‌تری بنویسید یا موضوع دیگری انتخاب کنید.</p><button type="button" onClick={reset}>نمایش همهٔ مقاله‌ها</button></div>}
    <div className="blog-grid">{shown.map((post,index)=><article className={`blog-card prism-edge${index===0?" featured":""}`} key={post.id}>
      <Link className="blog-card-image" href={`/blog/${post.slug}`}><Image src={post.image||"/assets/medical-visual.jpg"} alt={post.imageAlt||post.title} fill unoptimized priority={index<2} sizes="(max-width:800px) 100vw,50vw"/></Link>
      <div className="blog-card-copy"><span>{post.category}</span><h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2><p>{post.excerpt}</p><div><small><CalendarDays size={14}/>{formatDate(post.publishedTime)}</small><small><Clock3 size={14}/>{post.readingMinutes.toLocaleString("fa-IR")} دقیقه مطالعه</small></div><Link className="text-link" href={`/blog/${post.slug}`}>ادامه مطلب <ArrowLeft size={17}/></Link></div>
    </article>)}</div>
  </>;
}
