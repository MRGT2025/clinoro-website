import { CheckCircle2, ClipboardList, FileCheck2, PackageCheck, Truck } from "lucide-react";
import { InnerHero, PageCta } from "../inner-components";
import { getSiteContent } from "../../lib/site-content";
import { CustomContentBlocks } from "../custom-content";
import { InjectionLayer } from "../injection-layer";
import { pageMetadata } from "../../lib/seo";
export const generateMetadata=()=>pageMetadata("procurement");
const stepIcons=[ClipboardList,FileCheck2,Truck,PackageCheck];
export default async function ProcurementPage(){const content=await getSiteContent();return <InnerHero active="/procurement" {...content.pages.procurement}>
 <section className="section procurement-section"><div className="site-wrap"><div className="rfq-flow">{content.procurementSteps.map(({title,text},i)=>{const Icon=stepIcons[i%stepIcons.length];return <article key={`${title}-${i}`}><span className="rfq-index">0{i+1}</span><span className="rfq-icon"><Icon size={25}/></span><h2>{title}</h2><p>{text}</p></article>})}</div>
 <div className="rfq-checklist glass-panel prism-edge"><div><span className="eyebrow">WHAT TO INCLUDE</span><h2>برای پاسخ دقیق‌تر، این اطلاعات را ارسال کنید</h2></div><ul>{["نام و مدل تجهیز یا کاربرد موردنظر","تعداد و محل پروژه","نیازهای فنی یا استانداردهای خاص","زمان موردنظر برای تحویل","خدمات نصب، آموزش یا نگهداری"].map(x=><li key={x}><CheckCircle2 size={18}/>{x}</li>)}</ul></div>
 <PageCta title="RFQ پروژه را همین حالا شروع کنید" text="حتی اگر مدل دقیق دستگاه را نمی‌دانید، کاربرد و شرایط پروژه را بنویسید؛ مسیر انتخاب را با هم کامل می‌کنیم."/></div></section>
 <CustomContentBlocks blocks={content.customBlocks.procurement}/>
 <InjectionLayer content={content} page="procurement"/>
 </InnerHero>}
