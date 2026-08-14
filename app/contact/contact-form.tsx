"use client";
import Link from "next/link";
import { CheckCircle2, Clock3, LoaderCircle, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";
import { useSiteContent } from "../content-context";

type FormState={name:string;organization:string;phone:string;email:string;topic:string;productSlug:string;city:string;quantity:string;timeline:string;message:string;website:string;consent:boolean};
const emptyForm=(english=false):FormState=>({name:"",organization:"",phone:"",email:"",topic:english?"Product quotation":"استعلام محصول",productSlug:"",city:"",quantity:"",timeline:"",message:"",website:"",consent:false});

export function ContactForm({initialProductSlug="",locale="fa"}:{initialProductSlug?:string;locale?:"fa"|"en"}){
  const {general,products}=useSiteContent();
  const english=locale==="en";
  const [form,setForm]=useState<FormState>(()=>({...emptyForm(english),productSlug:products.some(item=>item.slug===initialProductSlug)?initialProductSlug:""}));
  const [reference,setReference]=useState("");
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  const update=<K extends keyof FormState>(key:K,value:FormState[K])=>setForm(current=>({...current,[key]:value}));
  async function submit(event:FormEvent){
    event.preventDefault();setBusy(true);setError("");
    try{
      const response=await fetch("/api/rfq",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...form,sourceUrl:window.location.href})});
      const result=await response.json() as {reference?:string;error?:string};
      if(!response.ok||!result.reference)throw new Error(result.error||(english?"The request could not be submitted":"ثبت درخواست انجام نشد"));
      setReference(result.reference);setForm(emptyForm(english));
    }catch(reason){setError(reason instanceof Error?reason.message:(english?"The request could not be submitted":"ثبت درخواست انجام نشد"))}finally{setBusy(false)}
  }
  return <section className={`section contact-section${english?" contact-section-en":""}`} lang={english?"en":"fa"} dir={english?"ltr":"rtl"}><div className="site-wrap contact-grid">
    <div className="contact-info"><span className="eyebrow">DIRECT CONTACT</span><h2>{english?"Share the project context":"اطلاعات اولیه را با ما به اشتراک بگذارید"}</h2><p>{english?"For a useful response, include intended use, quantity, location, timeline and the service scope you expect.":"برای پاسخ دقیق‌تر، کاربرد تجهیز، تعداد، شهر پروژه، بازه زمانی و خدمات موردنیاز را بنویسید."}</p><div className="contact-cards">
      <a href={`tel:${general.phone.replace(/\s/g,"")}`}><span><Phone size={21}/></span><div><small>PHONE</small><b dir="ltr">{general.phone}</b></div></a>
      <a href={`mailto:${general.email}`}><span><Mail size={21}/></span><div><small>EMAIL</small><b>{general.email}</b></div></a>
      <article><span><MapPin size={21}/></span><div><small>ADDRESS</small><b>{general.address}</b></div></article>
      <article><span><Clock3 size={21}/></span><div><small>{english?"RESPONSE WINDOW":"INITIAL RESPONSE"}</small><b>{english?"Confirmed for your request":"حداکثر تا ۲۴ ساعت کاری"}</b></div></article>
    </div></div>
    <form className="rfq-form glass-panel prism-edge" onSubmit={submit}>{reference?<div className="form-success" role="status"><CheckCircle2 size={42}/><h3>{english?"Request submitted successfully":"درخواست با موفقیت ثبت شد"}</h3><p>{english?"Your tracking reference:":"کد پیگیری شما:"}</p><strong dir="ltr">{reference}</strong><small>{english?"The request is now available to the Clinoro team for follow-up.":"درخواست در صندوق مدیریت Clinoro ثبت شده و قابل پیگیری است."}</small><button type="button" onClick={()=>setReference("")}>{english?"Submit another request":"ثبت درخواست دیگر"}</button></div>:<>
      <div className="form-head"><span>RFQ / CONTACT</span><b>{english?"Structured project request":"فرم درخواست واقعی"}</b></div><div className="form-fields">
        <label><span>{english?"Full name *":"نام و نام خانوادگی *"}</span><input required autoComplete="name" value={form.name} onChange={event=>update("name",event.target.value)} placeholder={english?"Your name":"نام شما"}/></label>
        <label><span>{english?"Organization / facility":"نام مرکز یا شرکت"}</span><input autoComplete="organization" value={form.organization} onChange={event=>update("organization",event.target.value)} placeholder={english?"Organization name":"نام مجموعه"}/></label>
        <label><span>{english?"Phone *":"شماره تماس *"}</span><input required autoComplete="tel" dir="ltr" value={form.phone} onChange={event=>update("phone",event.target.value)} placeholder="+971 ..."/></label>
        <label><span>{english?"Email":"ایمیل"}</span><input type="email" autoComplete="email" dir="ltr" value={form.email} onChange={event=>update("email",event.target.value)} placeholder="name@company.com"/></label>
        <label><span>{english?"Project location":"شهر پروژه"}</span><input value={form.city} onChange={event=>update("city",event.target.value)} placeholder={english?"City / country":"مثلاً اصفهان"}/></label>
        <label><span>{english?"Estimated quantity":"تعداد تقریبی"}</span><input value={form.quantity} onChange={event=>update("quantity",event.target.value)} placeholder={english?"e.g. 2 units":"مثلاً ۲ دستگاه"}/></label>
        <label><span>{english?"Request type":"موضوع درخواست"}</span><select value={form.topic} onChange={event=>update("topic",event.target.value)}>{english?<><option>Product quotation</option><option>Project consultation</option><option>Installation and training</option><option>Maintenance and parts</option></>:<><option>استعلام محصول</option><option>مشاوره پروژه</option><option>خدمات نصب و آموزش</option><option>نگهداری و قطعات</option></>}</select></label>
        <label><span>{english?"Timeline":"بازه زمانی"}</span><select value={form.timeline} onChange={event=>update("timeline",event.target.value)}>{english?<><option value="">Not specified</option><option>Urgent; under one month</option><option>1 to 3 months</option><option>3 to 6 months</option><option>Planning stage</option></>:<><option value="">مشخص نشده</option><option>فوری؛ کمتر از یک ماه</option><option>۱ تا ۳ ماه</option><option>۳ تا ۶ ماه</option><option>در حال برنامه‌ریزی</option></>}</select></label>
        <label className="full"><span>{english?"Related equipment":"محصول مرتبط"}</span><select value={form.productSlug} onChange={event=>update("productSlug",event.target.value)}><option value="">{english?"Not selected":"انتخاب نشده"}</option>{products.map(product=><option value={product.slug} key={product.slug}>{english?product.en:product.fa}</option>)}</select></label>
        <label className="full"><span>{english?"Requirement details *":"شرح نیاز *"}</span><textarea required minLength={12} maxLength={4000} value={form.message} onChange={event=>update("message",event.target.value)} placeholder={english?"Describe intended use, capacity, infrastructure and service expectations...":"کاربرد، تعداد، محل پروژه و نیازهای فنی را بنویسید..."}/></label>
        <label className="rfq-honeypot" aria-hidden="true"><span>{english?"Website":"وب‌سایت"}</span><input tabIndex={-1} autoComplete="off" value={form.website} onChange={event=>update("website",event.target.value)}/></label>
        <label className="full consent-field"><input type="checkbox" checked={form.consent} onChange={event=>update("consent",event.target.checked)} required/><span>{english?<>I accept the <Link href="/en/privacy" target="_blank">privacy policy</Link> and the use of this information to follow up my request.</>:<>با ثبت این فرم، <Link href="/privacy" target="_blank">سیاست حریم خصوصی</Link> و استفاده از اطلاعات برای پیگیری این درخواست را می‌پذیرم.</>}</span></label>
      </div>{error&&<p className="form-error" role="alert">{error}</p>}<button className="button button-primary" type="submit" disabled={busy}>{busy?<><LoaderCircle className="spin" size={18}/> {english?"Submitting":"در حال ثبت"}</>:<>{english?"Submit secure request":"ثبت امن درخواست"} <ShieldCheck size={18}/></>}</button>
    </>}</form>
  </div></section>
}
