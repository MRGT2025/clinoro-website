"use client";

import Image from "next/image";
import { Calculator, CheckCircle2, ClipboardCopy, Download, FileCheck2, Info, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import type { ProductItem } from "../../lib/site-content";

type CostKey = "acquisition" | "installation" | "training" | "annualService" | "annualConsumables" | "annualDowntime";
const costFields: Array<[CostKey,string,string]> = [
  ["acquisition","قیمت خرید","CAPEX"],
  ["installation","نصب و زیرساخت","ONE-TIME"],
  ["training","آموزش و راه‌اندازی","ONE-TIME"],
  ["annualService","سرویس سالانه","ANNUAL"],
  ["annualConsumables","مصرفی سالانه","ANNUAL"],
  ["annualDowntime","برآورد هزینه توقف","ANNUAL"],
];

const evidenceLabels={category:"اطلاعات گروه محصول",model:"مدل مشخص",verified:"مدل و مدارک تأییدشده"} as const;

export function DecisionPackWorkspace({
  products,
  intent,
  priority,
  coverage,
}: {
  products: ProductItem[];
  intent: string;
  priority: string;
  coverage: number;
}) {
  const [project,setProject]=useState({name:"",center:"",location:"",timeline:"",usage:"",note:""});
  const [currency,setCurrency]=useState("AED");
  const [years,setYears]=useState(5);
  const [costs,setCosts]=useState<Record<CostKey,number>>({acquisition:0,installation:0,training:0,annualService:0,annualConsumables:0,annualDowntime:0});
  const [notice,setNotice]=useState("");
  const totals=useMemo(()=>{
    const initial=costs.acquisition+costs.installation+costs.training;
    const annual=costs.annualService+costs.annualConsumables+costs.annualDowntime;
    return {initial,annual,total:initial+annual*years};
  },[costs,years]);
  const money=(value:number)=>new Intl.NumberFormat("en-US",{maximumFractionDigits:0}).format(value);
  const updateCost=(key:CostKey,value:string)=>setCosts(current=>({...current,[key]:Math.max(0,Number(value)||0)}));
  const printPack=()=>{
    document.documentElement.classList.add("decision-pack-print-mode");
    window.print();
    window.setTimeout(()=>document.documentElement.classList.remove("decision-pack-print-mode"),500);
  };
  const copyBrief=async()=>{
    const brief=[
      `CLINORO PROCUREMENT DECISION PACK`,
      `Project: ${project.name||"Not specified"}`,
      `Center: ${project.center||"Not specified"}`,
      `Location: ${project.location||"Not specified"}`,
      `Target timeline: ${project.timeline||"Not specified"}`,
      `Usage / capacity: ${project.usage||"Not specified"}`,
      `Decision profile: ${intent} / ${priority}`,
      `Selected equipment: ${products.map(item=>item.fa).join("، ")}`,
      `Analysis period: ${years} year(s)`,
      `Acquisition: ${money(costs.acquisition)} ${currency}`,
      `Installation and infrastructure: ${money(costs.installation)} ${currency}`,
      `Training and go-live: ${money(costs.training)} ${currency}`,
      `Annual service: ${money(costs.annualService)} ${currency}`,
      `Annual consumables: ${money(costs.annualConsumables)} ${currency}`,
      `Annual downtime estimate: ${money(costs.annualDowntime)} ${currency}`,
      `Planning TCO (${years} years): ${money(totals.total)} ${currency}`,
      `Requirement note: ${project.note||"Not specified"}`,
      `Scope: Planning aid only; final model, configuration and commercial terms require an official proposal.`,
    ].join("\n");
    try{await navigator.clipboard.writeText(brief);setNotice("خلاصه ساختاریافته کپی شد.");}
    catch{setNotice("امکان کپی خودکار نبود؛ از خروجی PDF استفاده کنید.");}
    window.setTimeout(()=>setNotice(""),2400);
  };
  return <div className="decision-pack-workspace">
    <div className="decision-pack-toolbar">
      <div><small>CLINORO PROCUREMENT WORKSPACE</small><h3>Decision Pack پروژه</h3><p>نیاز پروژه، انتخاب‌ها و فرضیات هزینه را در یک خروجی قابل ارائه جمع کنید.</p></div>
      <div><button type="button" onClick={()=>void copyBrief()}><ClipboardCopy size={17}/> کپی خلاصه</button><button type="button" className="primary" onClick={printPack}><Download size={17}/> چاپ / PDF</button></div>
    </div>
    {notice&&<p className="decision-pack-notice" role="status"><CheckCircle2 size={17}/>{notice}</p>}
    <section className="decision-project-brief">
      <header><span>01</span><div><small>PROJECT BRIEF</small><h4>شناسنامه تصمیم</h4></div></header>
      <div className="decision-input-grid">
        <label><span>نام پروژه</span><input value={project.name} onChange={event=>setProject({...project,name:event.target.value})} placeholder="مثلاً توسعه ICU"/></label>
        <label><span>مرکز / سازمان</span><input value={project.center} onChange={event=>setProject({...project,center:event.target.value})} placeholder="نام مرکز"/></label>
        <label><span>شهر / کشور</span><input value={project.location} onChange={event=>setProject({...project,location:event.target.value})} placeholder="محل پروژه"/></label>
        <label><span>زمان هدف</span><input value={project.timeline} onChange={event=>setProject({...project,timeline:event.target.value})} placeholder="مثلاً سه‌ماهه چهارم"/></label>
        <label><span>حجم استفاده</span><input value={project.usage} onChange={event=>setProject({...project,usage:event.target.value})} placeholder="تعداد تخت، تست یا شیفت"/></label>
        <label className="wide"><span>نیاز یا محدودیت اصلی</span><textarea value={project.note} onChange={event=>setProject({...project,note:event.target.value})} placeholder="زیرساخت، workflow، محدودیت زمانی یا سطح خدمات مورد انتظار"/></label>
      </div>
      <div className="decision-profile-strip"><span><small>مرحله پروژه</small><b>{intent}</b></span><span><small>اولویت</small><b>{priority}</b></span><span><small>پوشش اطلاعات اولیه</small><b>{coverage.toLocaleString("fa-IR")}٪</b></span></div>
    </section>
    <section className="decision-selected-products">
      <header><span>02</span><div><small>SHORTLIST & EVIDENCE</small><h4>انتخاب‌ها و وضعیت شواهد</h4></div></header>
      <div>{products.map(product=><article key={product.slug}>
        <div className="decision-product-head"><span><Image src={product.image} alt={`تصویر مرجع ${product.fa}`} fill unoptimized sizes="72px"/></span><div><small>{product.en}</small><b>{product.fa}</b><em>{evidenceLabels[product.procurement.evidenceLevel]}</em></div></div>
        <dl><div><dt>زمان تأمین</dt><dd>{product.procurement.leadTime}</dd></div><div><dt>گارانتی</dt><dd>{product.procurement.warranty}</dd></div><div><dt>SLA</dt><dd>{product.procurement.serviceResponse}</dd></div></dl>
        <div className="decision-readiness-columns"><div><small>زیرساخت</small>{product.procurement.infrastructure.map(item=><span key={item}><CheckCircle2 size={13}/>{item}</span>)}</div><div><small>آزمون پذیرش</small>{product.procurement.acceptance.map(item=><span key={item}><FileCheck2 size={13}/>{item}</span>)}</div><div><small>چرخه عمر</small>{product.procurement.lifecycle.map(item=><span key={item}><ShieldCheck size={13}/>{item}</span>)}</div></div>
      </article>)}</div>
    </section>
    <section className="tco-planner">
      <header><span>03</span><div><small>TOTAL COST OF OWNERSHIP</small><h4>برآورد برنامه‌ریزی هزینه چرخه عمر</h4></div><Calculator size={25}/></header>
      <div className="tco-controls"><label><span>واحد پول</span><select value={currency} onChange={event=>setCurrency(event.target.value)}><option>AED</option><option>USD</option><option>EUR</option><option>IRR</option></select></label><label><span>دوره تحلیل</span><select value={years} onChange={event=>setYears(Number(event.target.value))}>{[1,3,5,7,10].map(value=><option value={value} key={value}>{value.toLocaleString("fa-IR")} سال</option>)}</select></label></div>
      <div className="tco-inputs">{costFields.map(([key,label,kind])=><label key={key}><span>{label}<small>{kind}</small></span><input dir="ltr" inputMode="decimal" type="number" min="0" value={costs[key]||""} onChange={event=>updateCost(key,event.target.value)} placeholder="0"/><em>{currency}</em></label>)}</div>
      <div className="tco-results"><article><small>هزینه اولیه</small><b>{money(totals.initial)}</b><span>{currency}</span></article><article><small>هزینه سالانه</small><b>{money(totals.annual)}</b><span>{currency}</span></article><article className="total"><small>TCO برنامه‌ریزی {years.toLocaleString("fa-IR")} ساله</small><b>{money(totals.total)}</b><span>{currency}</span></article></div>
      <p><Info size={16}/>این محاسبه فقط ابزار برنامه‌ریزی است و قیمت، نرخ ارز یا پیشنهاد فروش محسوب نمی‌شود. ارقام نهایی باید در پیشنهاد رسمی همان پروژه تأیید شوند.</p>
    </section>
    <footer className="decision-pack-footer"><Image src="/assets/clinoro-logo-primary.png" width={170} height={44} alt="Clinoro" unoptimized/><div><b>PRECISION · MEDICAL TECHNOLOGY · COMMERCE</b><span suppressHydrationWarning>Generated {new Date().toLocaleDateString("en-CA")}</span></div></footer>
  </div>;
}
