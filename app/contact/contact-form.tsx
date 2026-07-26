"use client";
import Link from "next/link";
import { CheckCircle2, Clock3, LoaderCircle, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";
import { useSiteContent } from "../content-context";

type FormState={name:string;organization:string;phone:string;email:string;topic:string;productSlug:string;city:string;quantity:string;timeline:string;message:string;website:string;consent:boolean};
const emptyForm:FormState={name:"",organization:"",phone:"",email:"",topic:"استعلام محصول",productSlug:"",city:"",quantity:"",timeline:"",message:"",website:"",consent:false};

export function ContactForm({initialProductSlug=""}:{initialProductSlug?:string}){
  const {general,products}=useSiteContent();
  const [form,setForm]=useState<FormState>(()=>({...emptyForm,productSlug:products.some(item=>item.slug===initialProductSlug)?initialProductSlug:""}));
  const [reference,setReference]=useState("");
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  const update=<K extends keyof FormState>(key:K,value:FormState[K])=>setForm(current=>({...current,[key]:value}));
  async function submit(event:FormEvent){
    event.preventDefault();setBusy(true);setError("");
    try{
      const response=await fetch("/api/rfq",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...form,sourceUrl:window.location.href})});
      const result=await response.json() as {reference?:string;error?:string};
      if(!response.ok||!result.reference)throw new Error(result.error||"ثبت درخواست انجام نشد");
      setReference(result.reference);setForm(emptyForm);
    }catch(reason){setError(reason instanceof Error?reason.message:"ثبت درخواست انجام نشد")}finally{setBusy(false)}
  }
  return <section className="section contact-section"><div className="site-wrap contact-grid">
    <div className="contact-info"><span className="eyebrow">DIRECT CONTACT</span><h2>اطلاعات اولیه را با ما به اشتراک بگذارید</h2><p>برای پاسخ دقیق‌تر، کاربرد تجهیز، تعداد، شهر پروژه، بازه زمانی و خدمات موردنیاز را بنویسید.</p><div className="contact-cards">
      <a href={`tel:${general.phone.replace(/\s/g,"")}`}><span><Phone size={21}/></span><div><small>PHONE</small><b dir="ltr">{general.phone}</b></div></a>
      <a href={`mailto:${general.email}`}><span><Mail size={21}/></span><div><small>EMAIL</small><b>{general.email}</b></div></a>
      <article><span><MapPin size={21}/></span><div><small>ADDRESS</small><b>{general.address}</b></div></article>
      <article><span><Clock3 size={21}/></span><div><small>INITIAL RESPONSE</small><b>حداکثر تا ۲۴ ساعت کاری</b></div></article>
    </div></div>
    <form className="rfq-form glass-panel prism-edge" onSubmit={submit}>{reference?<div className="form-success" role="status"><CheckCircle2 size={42}/><h3>درخواست با موفقیت ثبت شد</h3><p>کد پیگیری شما:</p><strong dir="ltr">{reference}</strong><small>درخواست در صندوق مدیریت Clinoro ثبت شده و قابل پیگیری است.</small><button type="button" onClick={()=>setReference("")}>ثبت درخواست دیگر</button></div>:<>
      <div className="form-head"><span>RFQ / CONTACT</span><b>فرم درخواست واقعی</b></div><div className="form-fields">
        <label><span>نام و نام خانوادگی *</span><input required autoComplete="name" value={form.name} onChange={event=>update("name",event.target.value)} placeholder="نام شما"/></label>
        <label><span>نام مرکز یا شرکت</span><input autoComplete="organization" value={form.organization} onChange={event=>update("organization",event.target.value)} placeholder="نام مجموعه"/></label>
        <label><span>شماره تماس *</span><input required autoComplete="tel" dir="ltr" value={form.phone} onChange={event=>update("phone",event.target.value)} placeholder="+98 ..."/></label>
        <label><span>ایمیل</span><input type="email" autoComplete="email" dir="ltr" value={form.email} onChange={event=>update("email",event.target.value)} placeholder="name@company.com"/></label>
        <label><span>شهر پروژه</span><input value={form.city} onChange={event=>update("city",event.target.value)} placeholder="مثلاً اصفهان"/></label>
        <label><span>تعداد تقریبی</span><input value={form.quantity} onChange={event=>update("quantity",event.target.value)} placeholder="مثلاً ۲ دستگاه"/></label>
        <label><span>موضوع درخواست</span><select value={form.topic} onChange={event=>update("topic",event.target.value)}><option>استعلام محصول</option><option>مشاوره پروژه</option><option>خدمات نصب و آموزش</option><option>نگهداری و قطعات</option></select></label>
        <label><span>بازه زمانی</span><select value={form.timeline} onChange={event=>update("timeline",event.target.value)}><option value="">مشخص نشده</option><option>فوری؛ کمتر از یک ماه</option><option>۱ تا ۳ ماه</option><option>۳ تا ۶ ماه</option><option>در حال برنامه‌ریزی</option></select></label>
        <label className="full"><span>محصول مرتبط</span><select value={form.productSlug} onChange={event=>update("productSlug",event.target.value)}><option value="">انتخاب نشده</option>{products.map(product=><option value={product.slug} key={product.slug}>{product.fa}</option>)}</select></label>
        <label className="full"><span>شرح نیاز *</span><textarea required minLength={12} maxLength={4000} value={form.message} onChange={event=>update("message",event.target.value)} placeholder="کاربرد، تعداد، محل پروژه و نیازهای فنی را بنویسید..."/></label>
        <label className="rfq-honeypot" aria-hidden="true"><span>وب‌سایت</span><input tabIndex={-1} autoComplete="off" value={form.website} onChange={event=>update("website",event.target.value)}/></label>
        <label className="full consent-field"><input type="checkbox" checked={form.consent} onChange={event=>update("consent",event.target.checked)} required/><span>با ثبت این فرم، <Link href="/privacy" target="_blank">سیاست حریم خصوصی</Link> و استفاده از اطلاعات برای پیگیری این درخواست را می‌پذیرم.</span></label>
      </div>{error&&<p className="form-error" role="alert">{error}</p>}<button className="button button-primary" type="submit" disabled={busy}>{busy?<><LoaderCircle className="spin" size={18}/> در حال ثبت</>:<>ثبت امن درخواست <ShieldCheck size={18}/></>}</button>
    </>}</form>
  </div></section>
}
