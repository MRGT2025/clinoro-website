import type { Metadata } from "next";
import { getSiteContent, type PageKey } from "./site-content";

const paths:Record<Exclude<PageKey,"home">,string>={products:"/products",services:"/services",solutions:"/solutions",procurement:"/procurement",about:"/about",contact:"/contact",blog:"/blog"};
export async function pageMetadata(key:Exclude<PageKey,"home">):Promise<Metadata>{
  const content=await getSiteContent();const page=content.pages[key];const url=paths[key];
  return {title:page.title,description:page.text,alternates:{canonical:url},openGraph:{title:`${page.title} | Clinoro`,description:page.text,url,images:[{url:page.image,alt:page.title}]},twitter:{card:"summary_large_image",title:`${page.title} | Clinoro`,description:page.text,images:[page.image]}};
}
