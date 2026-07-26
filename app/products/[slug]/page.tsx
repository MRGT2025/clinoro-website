import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, ChevronLeft, Download, FileText, ShieldCheck, Wrench } from "lucide-react";
import { getSiteContent } from "../../../lib/site-content";
import { PageShell } from "../../components";

type ProductParams={params:Promise<{slug:string}>};

export async function generateMetadata({params}:ProductParams):Promise<Metadata>{
  const {slug}=await params;const content=await getSiteContent();const product=content.products.find(item=>item.slug===slug);
  if(!product)return {title:"محصول پیدا نشد | Clinoro"};
  const title=`${product.fa} | تجهیزات پزشکی Clinoro`;
  return {title,description:product.summary,alternates:{canonical:`/products/${product.slug}`},openGraph:{title,description:product.summary,url:`/products/${product.slug}`,type:"website",images:[{url:product.image,alt:`تصویر مرجع ${product.fa}`}]}};
}

export default async function ProductDetailPage({params}:ProductParams){
  const {slug}=await params;const content=await getSiteContent();const product=content.products.find(item=>item.slug===slug);if(!product)notFound();
  const schema={"@context":"https://schema.org","@type":"Product",name:product.fa,alternateName:product.en,description:product.summary,image:`https://clinoromedical.com${product.image}`,category:product.tag,brand:{"@type":"Brand",name:product.brand},model:product.model,url:`https://clinoromedical.com/products/${product.slug}`};
  const crumbs={"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"خانه",item:"https://clinoromedical.com/"},{"@type":"ListItem",position:2,name:"محصولات",item:"https://clinoromedical.com/products"},{"@type":"ListItem",position:3,name:product.fa,item:`https://clinoromedical.com/products/${product.slug}`}]};
  return <PageShell active="/products"><main id="main-content" className="product-detail-page"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(crumbs)}}/>
    <section className="product-detail-hero"><div className="product-detail-aura"/><div className="site-wrap product-detail-hero-grid">
      <div className="product-detail-media prism-edge"><Image src={product.image} alt={`تصویر مرجع گروه محصول ${product.fa}`} fill priority unoptimized sizes="(max-width:900px) 100vw,52vw"/><span>REFERENCE IMAGE · {product.imageLicense}</span></div>
      <div className="product-detail-copy glass-panel prism-edge"><div className="breadcrumbs"><Link href="/">خانه</Link><ChevronLeft size={14}/><Link href="/products">محصولات</Link><ChevronLeft size={14}/><span>{product.fa}</span></div><span className="hero-kicker">{product.tag}</span><h1>{product.fa}</h1><small>{product.en}</small><p>{product.summary}</p><dl><div><dt>برند</dt><dd>{product.brand}</dd></div><div><dt>مدل</dt><dd>{product.model}</dd></div><div><dt>وضعیت تأمین</dt><dd>{product.availability}</dd></div></dl><div className="inner-actions"><Link className="button button-primary" href={`/contact?product=${product.slug}`}>درخواست پیشنهاد و دیتاشیت <ArrowLeft size={17}/></Link></div></div>
    </div></section>
    <section className="section product-detail-content"><div className="site-wrap product-detail-layout"><div className="product-detail-main">
      <article className="detail-card glass-panel"><span className="eyebrow">INTENDED USE</span><h2>کاربرد و دامنه انتخاب</h2><p>{product.intendedUse}</p><div className="product-disclaimer"><ShieldCheck size={20}/><p>اطلاعات این صفحه برای معرفی گروه محصول است. مشخصات نهایی، برند، مدل و کاربرد مجاز فقط در پیشنهاد فنی و دیتاشیت رسمی مدل منتخب تأیید می‌شود.</p></div></article>
      <article className="detail-card glass-panel"><span className="eyebrow">TECHNICAL PROFILE</span><h2>مشخصات قابل انتخاب</h2><div className="technical-table">{product.technicalSpecs.map(spec=><div key={`${spec.label}-${spec.value}`}><b>{spec.label}</b><span>{spec.value}</span></div>)}</div></article>
      <article className="detail-card glass-panel"><span className="eyebrow">DOCUMENTS</span><h2>دیتاشیت و مدارک</h2>{product.documents.length?<div className="document-list">{product.documents.map(document=><a href={document.url} target="_blank" rel="noreferrer" key={`${document.title}-${document.url}`}><FileText size={19}/><span><b>{document.title}</b><small>{document.type}</small></span><Download size={17}/></a>)}</div>:<div className="document-empty"><FileText size={24}/><div><b>دیتاشیت پس از انتخاب مدل ارائه می‌شود</b><p>برای جلوگیری از ارائه مشخصات اشتباه، سند رسمی همراه پیشنهاد فنی همان برند و مدل منتخب ارسال خواهد شد.</p></div></div>}</article>
    </div><aside className="product-detail-aside"><article className="detail-card glass-panel"><span className="eyebrow">KEY POINTS</span><h2>ویژگی‌های کلیدی</h2><ul>{product.specs.map(spec=><li key={spec}><Check size={16}/>{spec}</li>)}</ul></article><article className="detail-card glass-panel"><span className="eyebrow">LIFECYCLE SERVICES</span><h2>خدمات همراه</h2><ul>{product.services.map(service=><li key={service}><Wrench size={16}/>{service}</li>)}</ul></article><article className="image-credit-card"><small>اعتبار تصویر مرجع</small><a href={product.imageSource} target="_blank" rel="license noreferrer">{product.imageCredit} · {product.imageLicense}</a><p>تصویر صرفاً نماینده گروه محصول است و به معنی عرضه برند نمایش‌داده‌شده نیست.</p></article></aside></div></section>
  </main></PageShell>;
}
