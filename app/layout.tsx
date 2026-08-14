import type { Metadata } from "next";
import "@fontsource/vazirmatn/300.css";
import "@fontsource/vazirmatn/400.css";
import "@fontsource/vazirmatn/500.css";
import "@fontsource/vazirmatn/600.css";
import "@fontsource/vazirmatn/700.css";
import "@fontsource/vazirmatn/800.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "@fontsource/manrope/800.css";
import "./globals.css";
import { getSiteContent } from "../lib/site-content";
import { SiteContentProvider } from "./content-context";
import { BrandIntro } from "./brand-intro";

export const dynamic="force-dynamic";
export async function generateMetadata():Promise<Metadata>{const content=await getSiteContent();return{metadataBase:new URL("https://clinoromedical.com"),title:{default:content.general.metaTitle,template:"%s | Clinoro"},description:content.general.metaDescription,applicationName:"Clinoro Medical Technologies",authors:[{name:"Clinoro"}],creator:"Clinoro",publisher:"Clinoro",other:{"clinoro-deployment":"brand-identity-20260814"},formatDetection:{email:false,address:false,telephone:false},robots:{index:true,follow:true,googleBot:{index:true,follow:true,"max-image-preview":"large","max-snippet":-1,"max-video-preview":-1}},openGraph:{type:"website",locale:"fa_IR",siteName:"Clinoro Medical Technologies",title:content.general.metaTitle,description:content.general.metaDescription,url:"/",images:[{url:content.home.heroImage,alt:"Clinoro Medical Technologies"}]},twitter:{card:"summary_large_image",title:content.general.metaTitle,description:content.general.metaDescription,images:[content.home.heroImage]},manifest:"/manifest.webmanifest",icons:{icon:"/assets/clinoro-app-icon.png",shortcut:"/assets/clinoro-app-icon.png",apple:"/assets/clinoro-app-icon.png"}}}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const content=await getSiteContent();
  const clientContent={...content,blogPosts:content.blogPosts.map(post=>({...post,content:"",sources:[]}))};
  const organization={"@context":"https://schema.org","@type":"Organization",name:"Clinoro Medical Technologies",alternateName:content.general.brand,url:"https://clinoromedical.com",logo:"https://clinoromedical.com/assets/clinoro-mark-primary.png",email:content.general.email,telephone:content.general.phone,address:{"@type":"PostalAddress",streetAddress:content.general.address,addressCountry:"IR"},contactPoint:{"@type":"ContactPoint",contactType:"sales and technical enquiries",telephone:content.general.phone,email:content.general.email,availableLanguage:["fa","en"]}};
  const introState=`try{if(sessionStorage.getItem("clinoro-brand-intro-v1")==="seen"||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.clinoroIntro="seen"}catch{}`;
  return <html lang="fa" dir="rtl"><body><script dangerouslySetInnerHTML={{__html:introState}}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(organization)}}/><BrandIntro motionMode={content.general.motionMode}/><SiteContentProvider content={clientContent}>{children}</SiteContentProvider></body></html>;
}
