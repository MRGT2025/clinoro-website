import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, BookOpenCheck, Boxes, CalendarDays, ClipboardCheck, Clock3, Gauge, HeartPulse, Microscope, PackageCheck, ScanLine, Settings, ShieldCheck, Sparkles, Stethoscope, Syringe, Wrench } from "lucide-react";
import { PageShell, ProofRail, SectionTitle } from "./components";
import { ClinicalPlanner, HeroSignal, InteractiveShowcase, IntentRibbon } from "./experience";
import { getSiteContent } from "../lib/site-content";
import { CustomContentBlocks } from "./custom-content";
import { InjectionLayer } from "./injection-layer";
import type { Metadata } from "next";
import { getPublishedBlogPosts } from "../lib/blog";

export const metadata:Metadata={alternates:{canonical:"/"}};

const categoryIcons=[HeartPulse,ScanLine,Microscope,Stethoscope,Syringe,Gauge];
const serviceIcons=[ClipboardCheck,PackageCheck,Settings,Wrench];
const readingMinutes=(text:string)=>Math.max(2,Math.ceil(text.trim().split(/\s+/).filter(Boolean).length/180));

export default async function Home() { const content=await getSiteContent(); const latestPosts=getPublishedBlogPosts(content.blogPosts).slice(0,3); return <PageShell active="/"><main id="main-content">
  <section className="hero prism-scene"><div className="hero-mesh"/><div className="hero-orb hero-orb-one"/><div className="hero-orb hero-orb-two"/><div className="hero-orbit orbit-one"/><div className="hero-orbit orbit-two"/><div className="hero-particles"><i/><i/><i/><i/><i/></div>
    <div className="site-wrap hero-layout">
      <div className="hero-image-wrap reveal-image"><div className="hero-image-mask"><Image src={content.home.heroImage} alt="متخصص و تجهیزات پیشرفته تصویربرداری پزشکی" fill priority unoptimized sizes="(max-width:900px) 100vw,55vw"/><div className="hero-image-overlay"/><div className="hero-reticle"><i/><i/><span>CLINORO<br/>VISION</span></div></div>
        <div className="data-chip chip-top glass-panel"><span className="signal-dot"/><div><small>SYSTEM STATUS</small><b>Operational</b></div></div>
        <div className="data-chip chip-bottom glass-panel"><span className="mini-wave"/><div><small>CLINICAL SUPPORT</small><b>Connected</b></div></div>
      </div>
      <div className="hero-copy glass-panel prism-edge reveal-up"><span className="hero-kicker"><Sparkles size={15}/> {content.home.kicker}</span><h1>{content.home.title}<br/><HeroSignal signals={content.home.signals}/></h1><p>{content.home.intro}</p>
        <div className="hero-actions"><Link className="button button-primary" href="/products">مشاهده محصولات <ArrowLeft size={18}/></Link><Link className="button button-glass" href="/contact">شروع استعلام <ArrowLeft size={18}/></Link></div>
        <div className="hero-assurance"><span><BadgeCheck size={17}/> پیشنهاد فنی ساختارمند</span><span><BookOpenCheck size={17}/> اسناد و آموزش کامل</span></div>
      </div><ProofRail/>
    </div><div className="hero-side-label">ADVANCED MEDICAL SYSTEMS <span>2026</span></div><a className="scroll-cue" href="#systems" aria-label="حرکت به بخش بعدی"><span>SCROLL TO EXPLORE</span><i/></a>
  </section>
  <IntentRibbon/>
  <div className="capability-ticker" aria-hidden="true"><div><span>CLINICAL TECHNOLOGY</span><i/> <span>PROCUREMENT</span><i/> <span>INSTALLATION</span><i/> <span>TRAINING</span><i/> <span>LIFECYCLE SUPPORT</span><i/> <span>CLINICAL TECHNOLOGY</span><i/> <span>PROCUREMENT</span><i/> <span>INSTALLATION</span></div></div>
  <div id="systems"><InteractiveShowcase/></div>
  <div id="planner"><ClinicalPlanner/></div>
  <section className="section section-light motion-section" id="categories"><div className="site-wrap"><SectionTitle eyebrow="PRODUCT ECOSYSTEM" title="تجهیز مناسب برای هر محیط درمانی" text="دسته‌بندی محصولات بر اساس سناریوی واقعی استفاده، نیاز بالینی و مسیر تصمیم‌گیری مراکز درمانی شکل گرفته است."/>
    <div className="category-showcase" data-reveal>{content.home.categories.map(({title,en,image},index)=>{const Icon=categoryIcons[index%categoryIcons.length];return <Link className={`category-card${index===0?" featured": ""}`} href="/products" key={`${title}-${index}`}><Image src={image} alt={title} fill unoptimized sizes="(max-width:700px) 100vw,33vw"/><div className="category-shade"/><span className="category-index">{String(index+1).padStart(2,"0")}</span><span className="category-icon"><Icon size={21}/></span><div><small>{en}</small><h3>{title}</h3></div><ArrowLeft className="category-arrow" size={19}/></Link>})}</div>
    <div className="section-action"><Link href="/products">مشاهده تمام محصولات <ArrowLeft size={17}/></Link></div>
  </div></section>
  <section className="section services-section motion-section"><div className="services-glow"/><div className="service-radar"/><div className="site-wrap"><SectionTitle eyebrow="BEYOND EQUIPMENT" title="خدماتی که خرید را به یک راهکار کامل تبدیل می‌کنند" text="در Clinoro، تحویل دستگاه پایان مسیر نیست. کیفیت واقعی زمانی شکل می‌گیرد که انتخاب، اجرا و پشتیبانی در یک جریان منسجم باشند."/>
    <div className="services-grid" data-reveal>{content.home.serviceCards.map(({title,text},index)=>{const Icon=serviceIcons[index%serviceIcons.length];return <article className="service-lens prism-edge" key={`${title}-${index}`}><span className="service-number">{String(index+1).padStart(2,"0")}</span><span className="service-icon"><Icon size={25}/></span><h3>{title}</h3><p>{text}</p><Link href="/services" aria-label={`جزئیات ${title}`}><ArrowLeft size={18}/></Link></article>})}</div>
  </div></section>
  <section className="section section-light motion-section"><div className="site-wrap story-layout"><div className="story-visual prism-edge" data-reveal><Image src={content.home.storyImage} alt="فناوری پزشکی کلینورو" fill unoptimized sizes="(max-width:900px) 100vw,48vw"/><div className="story-panel glass-panel"><span>360°</span><div><b>پوشش کامل پروژه</b><small>از انتخاب تا بهره‌برداری</small></div></div><div className="story-scan"/></div>
    <div className="story-copy"><span className="eyebrow">CLINORO STANDARD</span><h2>{content.home.storyTitle}</h2><p>{content.home.storyText}</p><div className="story-points">
      <article><span><ShieldCheck size={20}/></span><div><b>انتخاب مبتنی بر نیاز واقعی</b><p>مشخصات فنی به زبان تصمیم‌گیری و کاربرد ترجمه می‌شوند.</p></div></article>
      <article><span><Boxes size={20}/></span><div><b>مدارک و فرآیند شفاف</b><p>پیشنهاد، دیتاشیت، زمان‌بندی و تعهدات از ابتدا روشن‌اند.</p></div></article>
      <article><span><Wrench size={20}/></span><div><b>خدمات قابل اتکا</b><p>نصب، آموزش و نگهداری بخشی از معماری اصلی پروژه‌اند.</p></div></article>
    </div><Link className="text-link" href="/about">بیشتر درباره Clinoro <ArrowLeft size={18}/></Link></div>
  </div></section>
  {!!latestPosts.length&&<section className="section insight-section motion-section"><div className="insight-aura"/><div className="site-wrap"><SectionTitle eyebrow="CLINORO JOURNAL · UPDATED" title="تصمیم‌های بهتر با دانش به‌روز" text="تحلیل‌های کاربردی برای خرید، یکپارچه‌سازی، امنیت و نگهداری فناوری‌های پزشکی؛ مبتنی بر منابع معتبر و قابل پیگیری."/><div className="insight-grid" data-reveal>{latestPosts.map((post,index)=><Link className={`insight-card prism-edge${index===0?" lead":""}`} href={`/blog/${post.slug}`} key={post.id}><Image src={post.image} alt={post.title} fill unoptimized sizes="(max-width:800px) 100vw,40vw"/><span className="insight-shade"/><div><small>{post.category}</small><h3>{post.title}</h3><p>{post.excerpt}</p><footer><span><CalendarDays size={13}/>{new Date(post.publishedAt).toLocaleDateString("fa-IR")}</span><span><Clock3 size={13}/>{readingMinutes(post.content).toLocaleString("fa-IR")} دقیقه</span><em>بخوانید <ArrowLeft size={15}/></em></footer></div></Link>)}</div><div className="section-action light"><Link href="/blog">ورود به ژورنال Clinoro <ArrowLeft size={17}/></Link></div></div></section>}
  <section className="section process-section motion-section"><div className="site-wrap"><SectionTitle eyebrow="RFQ WORKFLOW" title="یک مسیر روشن از نیاز تا تحویل" text="فرآیند استعلام طوری طراحی شده که تصمیم‌ها سریع‌تر، مدارک کامل‌تر و مسئولیت‌ها از ابتدا مشخص باشند."/>
    <div className="process-line" data-reveal>{content.home.process.map(({title,text},index)=><article key={`${title}-${index}`}><span>{String(index+1).padStart(2,"0")}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
    <div className="process-cta glass-panel prism-edge"><div><span className="eyebrow">READY TO START?</span><h2>{content.home.finalCta.title}</h2><p>{content.home.finalCta.text}</p></div><Link className="button button-primary" href="/contact">شروع استعلام <ArrowLeft size={18}/></Link></div>
  </div></section>
  <CustomContentBlocks blocks={content.customBlocks.home}/>
  <InjectionLayer content={content} page="home"/>
</main></PageShell>; }
