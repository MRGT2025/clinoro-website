import { ensureDatabase, getD1 } from "../db";

export const rfqStatuses=["new","reviewing","contacted","qualified","closed"] as const;
export type RfqStatus=typeof rfqStatuses[number];
export type RfqSubmission={
  id:string; reference:string; createdAt:number; updatedAt:number; status:RfqStatus;
  name:string; organization:string; phone:string; email:string; topic:string;
  productSlug:string; city:string; quantity:string; timeline:string; message:string;
  consent:boolean; sourceUrl:string;
};

type RfqRow={
  id:string;reference:string;created_at:number;updated_at:number;status:string;name:string;
  organization:string;phone:string;email:string;topic:string;product_slug:string;city:string;
  quantity:string;timeline:string;message:string;consent:number;source_url:string;
};

const clean=(value:unknown,max:number)=>typeof value==="string"?value.trim().slice(0,max):"";

export async function createRfqSubmission(input:Record<string,unknown>,request:Request){
  const name=clean(input.name,100);
  const organization=clean(input.organization,140);
  const phone=clean(input.phone,40);
  const email=clean(input.email,160).toLowerCase();
  const topic=clean(input.topic,100)||"استعلام محصول";
  const productSlug=clean(input.productSlug,120);
  const city=clean(input.city,100);
  const quantity=clean(input.quantity,40);
  const timeline=clean(input.timeline,80);
  const message=clean(input.message,4000);
  const sourceUrl=clean(input.sourceUrl,500);
  const consent=input.consent===true;
  if(clean(input.website,200))throw new Error("درخواست نامعتبر است");
  if(name.length<2)throw new Error("نام و نام خانوادگی را کامل وارد کنید");
  if(!/^[-+()\d\s]{7,40}$/.test(phone))throw new Error("شماره تماس معتبر نیست");
  if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new Error("ایمیل معتبر نیست");
  if(message.length<12)throw new Error("شرح درخواست باید حداقل ۱۲ کاراکتر باشد");
  if(!consent)throw new Error("تأیید سیاست حریم خصوصی الزامی است");
  await ensureDatabase();
  const now=Date.now();
  const recent=await getD1().prepare("SELECT COUNT(*) AS total FROM rfq_submissions WHERE created_at > ? AND (phone = ? OR (email <> '' AND email = ?))")
    .bind(now-10*60*1000,phone,email).first<{total:number}>();
  if(Number(recent?.total||0)>=3)throw new Error("تعداد درخواست‌ها زیاد است؛ لطفاً چند دقیقه دیگر دوباره تلاش کنید");
  const id=crypto.randomUUID();
  const reference=`CLN-${new Date(now).toISOString().slice(2,10).replaceAll("-","")}-${id.slice(0,6).toUpperCase()}`;
  const userAgent=clean(request.headers.get("user-agent"),300);
  await getD1().prepare("INSERT INTO rfq_submissions (id, reference, created_at, updated_at, status, name, organization, phone, email, topic, product_slug, city, quantity, timeline, message, consent, source_url, user_agent) VALUES (?, ?, ?, ?, 'new', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)")
    .bind(id,reference,now,now,name,organization,phone,email,topic,productSlug,city,quantity,timeline,message,sourceUrl,userAgent).run();
  return {reference};
}

export async function listRfqSubmissions(status?:string):Promise<RfqSubmission[]>{
  await ensureDatabase();
  const valid=rfqStatuses.includes(status as RfqStatus);
  const query=valid
    ? getD1().prepare("SELECT id, reference, created_at, updated_at, status, name, organization, phone, email, topic, product_slug, city, quantity, timeline, message, consent, source_url FROM rfq_submissions WHERE status = ? ORDER BY created_at DESC LIMIT 300").bind(status)
    : getD1().prepare("SELECT id, reference, created_at, updated_at, status, name, organization, phone, email, topic, product_slug, city, quantity, timeline, message, consent, source_url FROM rfq_submissions ORDER BY created_at DESC LIMIT 300");
  const result=await query.all<RfqRow>();
  return (result.results||[]).map(toSubmission);
}

export async function updateRfqStatus(id:string,status:string){
  if(!rfqStatuses.includes(status as RfqStatus))throw new Error("وضعیت نامعتبر است");
  await ensureDatabase();
  const result=await getD1().prepare("UPDATE rfq_submissions SET status = ?, updated_at = ? WHERE id = ?").bind(status,Date.now(),id).run();
  if(!result.meta.changes)throw new Error("درخواست پیدا نشد");
}

function toSubmission(row:RfqRow):RfqSubmission{return{
  id:row.id,reference:row.reference,createdAt:row.created_at,updatedAt:row.updated_at,status:rfqStatuses.includes(row.status as RfqStatus)?row.status as RfqStatus:"new",
  name:row.name,organization:row.organization,phone:row.phone,email:row.email,topic:row.topic,productSlug:row.product_slug,
  city:row.city,quantity:row.quantity,timeline:row.timeline,message:row.message,consent:Boolean(row.consent),sourceUrl:row.source_url,
}}
