import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import { PageShell } from "./components";

export function InnerHero({ active, eyebrow, title, text, image, note, credit, source, children }: { active:string; eyebrow:string; title:string; text:string; image:string; note:string; credit?:string; source?:string; children?:React.ReactNode }) {
  const identity=active.replace("/","")||"home";
  return <PageShell active={active}><main id="main-content"><section className={`inner-hero inner-${identity}`} data-page={identity}>
    <div className="inner-aura"/><div className="site-wrap inner-hero-grid">
      <div className="inner-visual prism-edge"><Image src={image} alt={`تصویر مرجع ${title}`} fill priority unoptimized sizes="(max-width:900px) 100vw,52vw"/><div className="inner-visual-shade"/><div className="inner-visual-note glass-panel"><span>CLINORO</span><b>{note}</b></div>{credit&&source&&<a className="inner-image-credit" href={source} target="_blank" rel="license noreferrer">عکس: {credit}</a>}</div>
      <div className="inner-copy glass-panel prism-edge"><div className="breadcrumbs"><Link href="/">خانه</Link><ChevronLeft size={14}/><span>{title}</span></div><span className="hero-kicker">{eyebrow}</span><h1>{title}</h1><p>{text}</p><div className="inner-actions"><Link className="button button-primary" href="/contact">شروع استعلام <ArrowLeft size={17}/></Link></div></div>
    </div>
  </section>{children}</main></PageShell>;
}

export function PageCta({ title, text }: { title:string; text:string }) { return <div className="page-cta glass-panel prism-edge"><div><span className="eyebrow">NEXT STEP</span><h2>{title}</h2><p>{text}</p></div><Link className="button button-primary" href="/contact">شروع گفتگو <ArrowLeft size={18}/></Link></div>; }
