import Image from "next/image";
import { Activity, Building2, FlaskConical, ScanLine } from "lucide-react";
import { InnerHero, PageCta } from "../inner-components";
import { getSiteContent } from "../../lib/site-content";
import { CustomContentBlocks } from "../custom-content";
import { InjectionLayer } from "../injection-layer";
import { pageMetadata } from "../../lib/seo";
export const generateMetadata=()=>pageMetadata("solutions");
const solutionIcons=[Activity,ScanLine,FlaskConical,Building2];
export default async function SolutionsPage(){const content=await getSiteContent();return <InnerHero active="/solutions" {...content.pages.solutions}>
 <section className="section section-light"><div className="site-wrap solution-stack">{content.solutions.map(({title,en,image,text},i)=>{const Icon=solutionIcons[i%solutionIcons.length];return <article className="solution-row" key={`${title}-${i}`}><div className="solution-image prism-edge"><Image src={image} alt={title} fill unoptimized sizes="(max-width:900px) 100vw,44vw"/></div><div className="solution-copy"><span><Icon size={22}/>{en}</span><h2>{title}</h2><p>{text}</p><div className="solution-meta"><b>0{i+1}</b><small>Equipment · Workflow · Service · Documentation</small></div></div></article>})}<PageCta title="راهکار مناسب مرکز شما باید از نیاز واقعی شروع شود" text="سناریوی پروژه را بفرستید تا ترکیب تجهیزات و خدمات متناسب با آن طراحی شود."/></div></section>
 <CustomContentBlocks blocks={content.customBlocks.solutions}/>
 <InjectionLayer content={content} page="solutions"/>
 </InnerHero>}
