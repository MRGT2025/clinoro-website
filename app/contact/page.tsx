import { InnerHero } from "../inner-components";
import { ContactForm } from "./contact-form";
import { getSiteContent } from "../../lib/site-content";
import { CustomContentBlocks } from "../custom-content";
import { InjectionLayer } from "../injection-layer";
import { pageMetadata } from "../../lib/seo";
export const generateMetadata=()=>pageMetadata("contact");
export default async function ContactPage({searchParams}:{searchParams:Promise<{product?:string|string[]}>}){const content=await getSiteContent();const query=await searchParams;const product=Array.isArray(query.product)?query.product[0]:query.product;return <InnerHero active="/contact" {...content.pages.contact}><ContactForm initialProductSlug={product}/><CustomContentBlocks blocks={content.customBlocks.contact}/><InjectionLayer content={content} page="contact"/></InnerHero>}
