import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Globe2, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import type { SiteContent } from "../../lib/site-content";
import { DocumentLocale } from "./document-locale";

const nav=[["Home","/en"],["Equipment","/en/products"],["Trust","/en/credentials"],["Start an RFQ","/en/contact"]] as const;

export function EnglishShell({content,children,active="/en"}:{content:SiteContent;children:ReactNode;active?:string}){
  return <div className="global-site" lang="en" dir="ltr">
    <DocumentLocale/>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="global-header"><div className="site-wrap"><Link href="/en" className="global-brand"><Image src={content.general.logoUrl} width={210} height={52} alt="Clinoro Medical Technologies" unoptimized priority/></Link><nav aria-label="Global navigation">{nav.map(([label,href])=><Link className={active===href?"active":""} href={href} key={href}>{label}</Link>)}</nav><div><Link className="global-language" href="/"><Globe2 size={16}/> فارسی</Link><Link className="global-rfq" href="/en/contact">Start an RFQ <ArrowRight size={16}/></Link></div></div></header>
    {children}
    <footer className="global-footer"><div className="site-wrap"><div><Image src={content.general.logoUrl} width={190} height={48} alt="Clinoro" unoptimized/><p>Medical technology procurement, implementation and lifecycle support—structured around the actual project.</p><span><ShieldCheck size={16}/> Documented procurement pathway</span></div><div><b>Explore</b>{nav.slice(1).map(([label,href])=><Link href={href} key={href}>{label}</Link>)}<Link href="/en/privacy">Privacy</Link><Link href="/en/terms">Terms</Link></div><div><b>Contact</b><a href={`mailto:${content.general.email}`}>{content.general.email}</a><a href={`tel:${content.general.phone.replace(/\s/g,"")}`}>{content.general.phone}</a><p lang="fa" dir="rtl">{content.general.address}</p></div></div><section className="site-wrap"><span>© 2026 Clinoro Medical Technologies</span><span>PRECISION · TRUST · INNOVATION · COMMERCE</span></section></footer>
  </div>;
}
