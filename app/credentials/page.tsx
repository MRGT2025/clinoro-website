import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Building2, FileCheck2, FolderKanban, ShieldCheck } from "lucide-react";
import { getSiteContent } from "../../lib/site-content";
import { PageShell } from "../components";

export const metadata:Metadata={title:"مدارک، پروژه‌ها و اعتماد | Clinoro",description:"مرکز شفافیت Clinoro برای نمایش مدارک، گواهی‌ها و سوابق تأییدشده.",alternates:{canonical:"/credentials"}};
const typeLabels={project:"پروژه",client:"مشتری",certificate:"گواهی",document:"مدرک"} as const;

export default async function CredentialsPage(){const content=await getSiteContent();const items=content.trustItems.filter(item=>item.published&&item.verified);return <PageShell><main id="main-content" className="trust-page">
  <section className="trust-hero"><div className="site-wrap"><span className="hero-kicker">TRUST & VERIFICATION</span><h1>اعتماد با مدرک ساخته می‌شود</h1><p>در این صفحه فقط پروژه‌ها، مشتریان، گواهی‌ها و مدارکی نمایش داده می‌شوند که در پنل مدیریت تأیید و برای انتشار فعال شده باشند.</p><div className="trust-principles"><article><ShieldCheck/><b>بدون ادعای تأییدنشده</b></article><article><FileCheck2/><b>منبع و سند قابل بررسی</b></article><article><BadgeCheck/><b>انتشار پس از تأیید مدیر</b></article></div></div></section>
  <section className="section"><div className="site-wrap">{items.length?<div className="trust-grid">{items.map(item=><article className="trust-card glass-panel" key={item.id}>{item.image&&<div className="trust-card-image"><Image src={item.image} alt={item.title} fill unoptimized/></div>}<span>{typeLabels[item.type]}</span><h2>{item.title}</h2>{item.subtitle&&<b>{item.subtitle}</b>}<p>{item.description}</p><div>{item.issuer&&<small>صادرکننده: {item.issuer}</small>}{item.issuedAt&&<small>تاریخ: {item.issuedAt}</small>}</div>{item.fileUrl&&<a href={item.fileUrl} target="_blank" rel="noreferrer">مشاهده مدرک</a>}</article>)}</div>:<div className="trust-empty glass-panel"><FolderKanban size={34}/><h2>مدارک عمومی در حال تکمیل است</h2><p>هنوز مدرک تأییدشده‌ای برای نمایش عمومی ثبت نشده است. این وضعیت عمداً شفاف نمایش داده می‌شود تا نام مشتری، پروژه یا گواهی بدون سند منتشر نشود.</p><Link className="button button-primary" href="/contact">درخواست اطلاعات رسمی</Link></div>}</div></section>
  <section className="section trust-process"><div className="site-wrap"><div className="section-title"><div><span className="eyebrow">DOCUMENTED WORKFLOW</span><h2>چارچوب اعتماد پروژه</h2></div></div><div className="trust-process-grid"><article><Building2/><b>تعریف نیاز</b><p>دامنه، مسئولیت‌ها و معیارهای پذیرش پیش از پیشنهاد روشن می‌شوند.</p></article><article><FileCheck2/><b>پیشنهاد مستند</b><p>مدل نهایی، مشخصات، مدارک و خدمات در پیشنهاد رسمی ثبت می‌شوند.</p></article><article><BadgeCheck/><b>تحویل قابل پیگیری</b><p>نصب، آموزش و مدارک تحویل در پرونده پروژه نگهداری می‌شوند.</p></article></div></div></section>
  </main></PageShell>}
