"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Boxes, ChevronLeft, Clock3, Headphones, Menu, Search, ShieldCheck, X } from "lucide-react";
import { ExperienceLayer } from "./experience";
import { useSiteContent } from "./content-context";
import { getPublishedBlogPosts } from "../lib/blog";

export const navigation = [
  ["خانه", "/"], ["محصولات", "/products"], ["خدمات", "/services"],
  ["راهکارها", "/solutions"], ["تأمین و RFQ", "/procurement"], ["بلاگ", "/blog"], ["درباره ما", "/about"], ["تماس", "/contact"],
] as const;

const staticSearchItems = [
  ["مانیتور علائم حیاتی ICU", "محصولات", "/products"], ["سیستم سونوگرافی", "محصولات", "/products"],
  ["ماشین بیهوشی", "محصولات", "/products"], ["آموزش و راه‌اندازی", "خدمات", "/services"],
  ["نگهداری پیشگیرانه", "خدمات", "/services"], ["فرآیند استعلام و RFQ", "تأمین", "/procurement"],
  ["راهنمای انتخاب تجهیزات پزشکی", "بلاگ", "/blog"],
] as const;

export function Brand() {
  const {general}=useSiteContent();
  return <Link className="brand" href="/" aria-label="صفحه اصلی کلینورو">
    {general.logoUrl?<span className="brand-lockup"><Image src={general.logoUrl} alt={general.logoAlt||general.brand} width={190} height={48} unoptimized priority/></span>:<><span className="brand-copy"><b>{general.brand}</b><small>{general.tagline}</small></span><span className="brand-cross" aria-hidden="true"><i /><i /></span></>}
  </Link>;
}

export function SiteHeader({ active = "/" }: { active?: string }) {
  const {blogPosts,products}=useSiteContent();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setSearchOpen(true); }
      if (event.key === "Escape") { setSearchOpen(false); setMenuOpen(false); }
    };
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true }); window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("keydown", onKey); };
  }, []);
  const searchItems=useMemo(()=>[...staticSearchItems,...products.map(product=>[product.fa,"محصولات",`/products/${product.slug}`] as const),...getPublishedBlogPosts(blogPosts).map(post=>[post.title,"بلاگ",`/blog/${post.slug}`] as const)],[blogPosts,products]);
  const results = useMemo(() => query.trim() ? searchItems.filter((item) => item[0].includes(query.trim())) : searchItems.slice(0, 5), [query,searchItems]);
  return <>
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}><div className="glass-nav prism-edge">
      <Brand />
      <nav className="desktop-nav" aria-label="منوی اصلی">{navigation.map(([label, href]) => <Link className={active === href ? "active" : ""} href={href} key={href}>{label}</Link>)}</nav>
      <div className="header-actions">
        <button className="icon-button search-button" onClick={() => setSearchOpen(true)} aria-label="جستجو" aria-controls="site-search-dialog" aria-expanded={searchOpen}><Search size={19}/><span>جستجو</span><kbd>⌘ K</kbd></button>
        <Link className="header-rfq" href="/contact">شروع استعلام <ArrowLeft size={16}/></Link>
        <button className="icon-button menu-button" onClick={() => setMenuOpen(true)} aria-label="باز کردن منو" aria-controls="mobile-navigation" aria-expanded={menuOpen}><Menu size={23}/></button>
      </div>
    </div></header>
    <div className={`mobile-panel${menuOpen ? " open" : ""}`} aria-hidden={!menuOpen}>
      <button className="mobile-backdrop" onClick={() => setMenuOpen(false)} aria-label="بستن منو"/>
      <div className="mobile-sheet prism-edge" id="mobile-navigation"><div className="mobile-head"><Brand/><button className="icon-button" onClick={() => setMenuOpen(false)} aria-label="بستن منو"><X size={22}/></button></div>
        <nav>{navigation.map(([label, href], index) => <Link href={href} key={href} onClick={() => setMenuOpen(false)}><span>{String(index + 1).padStart(2,"0")}</span>{label}<ChevronLeft size={18}/></Link>)}</nav>
      </div>
    </div>
    <div className={`search-layer${searchOpen ? " open" : ""}`} aria-hidden={!searchOpen}>
      <button className="search-backdrop" onClick={() => setSearchOpen(false)} aria-label="بستن جستجو"/>
      <div className="search-dialog prism-edge" id="site-search-dialog" role="dialog" aria-modal="true" aria-label="جستجو در سایت">
        <div className="search-input-wrap"><Search size={20}/><input autoFocus={searchOpen} value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="نام محصول، خدمت یا راهکار را بنویسید..."/><button onClick={()=>setSearchOpen(false)} aria-label="بستن"><X size={19}/></button></div>
        <div className="search-results">{results.map(([label,type,href])=><Link href={href} key={label} onClick={()=>setSearchOpen(false)}><span><small>{type}</small><b>{label}</b></span><ArrowLeft size={18}/></Link>)}{!results.length && <p>نتیجه‌ای پیدا نشد.</p>}</div>
      </div>
    </div>
  </>;
}

export function ProofRail() { const {home}=useSiteContent(); const icons=[Boxes,Clock3,Headphones]; return <div className="proof-rail glass-panel prism-edge reveal-up">{home.proofPoints.map((item,index)=>{const Icon=icons[index%icons.length];return <article key={`${item.title}-${index}`}><span className="proof-icon"><Icon size={24}/></span><div><b>{item.title}</b><small>{item.text}</small></div></article>})}</div>; }

export function SectionTitle({ eyebrow, title, text }: { eyebrow:string; title:string; text?:string }) { return <div className="section-title"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>{text && <p>{text}</p>}</div>; }

export function SiteFooter() { const {general}=useSiteContent(); return <footer className="site-footer"><div className="footer-aura"/><div className="site-wrap footer-grid">
  <div className="footer-brand"><Brand/><p>{general.footerText}</p><div className="footer-trust"><ShieldCheck size={18}/> مسیر مستند تأمین و پشتیبانی</div></div>
  <div><h3>دسترسی سریع</h3>{navigation.slice(1,5).map(([label,href])=><Link key={href} href={href}>{label}</Link>)}<Link href="/credentials">مدارک و اعتماد</Link><Link href="/privacy">حریم خصوصی</Link><Link href="/terms">شرایط استفاده</Link></div>
  <div><h3>ارتباط با ما</h3><p>{general.address}</p><a dir="ltr" href={`tel:${general.phone.replace(/\s/g,"")}`}>{general.phone}</a><a href={`mailto:${general.email}`}>{general.email}</a></div>
  </div><div className="site-wrap footer-bottom"><span>© 2026 Clinoro Medical Technologies</span><span>Equipment · Services · RFQ · Documentation</span></div></footer>; }

export function PageShell({ children, active="/" }: { children:React.ReactNode; active?:string }) { return <><a className="skip-link" href="#main-content">رفتن به محتوای اصلی</a><ExperienceLayer/><SiteHeader active={active}/>{children}<SiteFooter/></>; }
