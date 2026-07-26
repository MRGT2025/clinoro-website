import Image from "next/image";
import { BadgeCheck, Eye, Layers3, ShieldCheck } from "lucide-react";
import { InnerHero, PageCta } from "../inner-components";
import { getSiteContent } from "../../lib/site-content";
import { CustomContentBlocks } from "../custom-content";
import { InjectionLayer } from "../injection-layer";
import { pageMetadata } from "../../lib/seo";
export const generateMetadata=()=>pageMetadata("about");
const valueIcons=[Eye,Layers3,BadgeCheck,ShieldCheck];
export default async function AboutPage(){const content=await getSiteContent();return <InnerHero active="/about" {...content.pages.about}>
 <section className="section section-light"><div className="site-wrap"><div className="about-layout"><div className="about-copy"><span className="eyebrow">OUR POINT OF VIEW</span><h2>{content.about.headline}</h2>{content.about.paragraphs.map((paragraph,index)=><p key={index}>{paragraph}</p>)}</div><div className="about-visual prism-edge"><Image src={content.about.image} alt="رویکرد کلینورو" fill unoptimized sizes="(max-width:900px) 100vw,45vw"/></div></div>
 <div className="value-grid">{content.about.values.map(({title,text},index)=>{const Icon=valueIcons[index%valueIcons.length];return <article key={`${title}-${index}`}><span><Icon size={23}/></span><h3>{title}</h3><p>{text}</p></article>})}</div><PageCta title="برای پروژه بعدی، یک مسیر حرفه‌ای‌تر بسازیم" text="در هر مرحله‌ای که هستید، اطلاعات اولیه را بفرستید تا نقطه شروع مناسب مشخص شود."/></div></section>
 <CustomContentBlocks blocks={content.customBlocks.about}/>
 <InjectionLayer content={content} page="about"/>
 </InnerHero>}
