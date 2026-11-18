import type { Metadata } from "next";
import { getSiteContent, type PageKey } from "./site-content";

const paths:Record<Exclude<PageKey,"home">,string>={products:"/products",services:"/services",solutions:"/solutions",procurement:"/procurement",about:"/about",contact:"/contact",blog:"/blog"};
export async function pageMetadata(key:Exclude<PageKey,"home">):Promise<Metadata>{
  const searchTitles = {products:"خرید و تأمین تجهیزات پزشکی و بیمارستانی",services:"نصب، آموزش و نگهداری تجهیزات پزشکی",solutions:"راهکار تجهیز بیمارستان، کلینیک و آزمایشگاه",procurement:"استعلام قیمت و تأمین تجهیزات پزشکی در ایران",about:"درباره کلینورو؛ تأمین و پشتیبانی تجهیزات پزشکی",contact:"تماس با کلینورو و درخواست پیش‌فاکتور تجهیزات پزشکی",blog:"راهنمای خرید و نگهداری تجهیزات پزشکی"};
  const content=await getSiteContent();const page=content.pages[key];const url=paths[key];
  const english=key==="products"?"/en/products":key==="contact"?"/en/contact":undefined;
  return {title:searchTitles[key],description:page.text,alternates:{canonical:url,...(english?{languages:{"fa-IR":url,en:english}}:{})},openGraph:{title:`${page.title} | Clinoro`,description:page.text,url,images:[{url:page.image,alt:page.title}]},twitter:{card:"summary_large_image",title:`${page.title} | Clinoro`,description:page.text,images:[page.image]}};
}
