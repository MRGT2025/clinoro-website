"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { ProductItem } from "../../lib/site-content";

const filters=[['all','همه'],['critical','مراقبت ویژه'],['imaging','تصویربرداری'],['lab','آزمایشگاه'],['surgery','اتاق عمل'],['sterile','استریل']] as const;
export function ProductBrowser({products}:{products:ProductItem[]}){const[cat,setCat]=useState('all');const[q,setQ]=useState('');const shown=useMemo(()=>products.filter(p=>(cat==='all'||p.cat===cat)&&(p.fa.includes(q)||p.en.toLowerCase().includes(q.toLowerCase()))),[cat,q,products]);return <section className="section products-section"><div className="site-wrap">
 <div className="catalog-toolbar glass-panel"><div className="filter-row" aria-label="فیلتر گروه محصول">{filters.map(([id,label])=><button className={cat===id?'active':''} aria-pressed={cat===id} onClick={()=>setCat(id)} key={id}>{label}</button>)}</div><label className="catalog-search"><Search size={18}/><span className="sr-only">جستجوی محصول</span><input value={q} onChange={e=>setQ(e.target.value)} placeholder="جستجوی محصول..."/></label></div>
 <div className="product-grid">{shown.map(p=><article className="product-card" key={p.slug}><Link className="product-image" href={`/products/${p.slug}`} aria-label={`مشاهده ${p.fa}`}><Image src={p.image} alt={`تصویر مرجع ${p.fa}`} fill unoptimized sizes="(max-width:700px) 100vw,33vw"/><span>{p.tag}</span><small>تصویر مرجع</small></Link><div className="product-body"><small>{p.en}</small><h2>{p.fa}</h2><p>{p.summary}</p><ul>{p.specs.slice(0,3).map(s=><li key={s}><Check size={14}/>{s}</li>)}</ul><Link href={`/products/${p.slug}`}>مشخصات و خدمات <ArrowLeft size={17}/></Link></div></article>)}</div>
 {!shown.length&&<div className="empty-state">محصولی با این عنوان پیدا نشد.</div>}
 </div></section>}
