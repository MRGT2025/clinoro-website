import { BookOpenCheck, ClipboardCheck, PackageOpen, Settings, ShieldCheck, Wrench } from "lucide-react";
import { InnerHero, PageCta } from "../inner-components";
import { getSiteContent } from "../../lib/site-content";
import { CustomContentBlocks } from "../custom-content";
import { InjectionLayer } from "../injection-layer";
import { pageMetadata } from "../../lib/seo";
export const generateMetadata=()=>pageMetadata("services");

const serviceIcons=[ClipboardCheck,Settings,BookOpenCheck,Wrench,PackageOpen,ShieldCheck];
export default async function ServicesPage(){const content=await getSiteContent();return <InnerHero active="/services" {...content.pages.services}>
 <section className="section section-light"><div className="site-wrap"><div className="detail-grid">{content.services.map(({en,title,text,list},i)=>{const Icon=serviceIcons[i%serviceIcons.length];return <article className="detail-card prism-edge" key={`${title}-${i}`}><span className="detail-no">0{i+1}</span><span className="detail-icon"><Icon size={25}/></span><small>{en}</small><h2>{title}</h2><p>{text}</p><ul>{list.map(x=><li key={x}>{x}</li>)}</ul></article>})}</div><PageCta title="برای هر تجهیز، برنامه خدمات مناسب را تعریف کنیم" text="نوع تجهیز، محل پروژه و سطح خدمات موردنیاز را بفرستید تا مسیر اجرایی پیشنهادی آماده شود."/></div></section>
 <CustomContentBlocks blocks={content.customBlocks.services}/>
 <InjectionLayer content={content} page="services"/>
 </InnerHero>}
