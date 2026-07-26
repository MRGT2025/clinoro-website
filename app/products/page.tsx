import { InnerHero } from "../inner-components";
import { ProductBrowser } from "./product-browser";
import { getSiteContent } from "../../lib/site-content";
import { CustomContentBlocks } from "../custom-content";
import { InjectionLayer } from "../injection-layer";
import { pageMetadata } from "../../lib/seo";
export const generateMetadata=()=>pageMetadata("products");

export default async function ProductsPage(){const content=await getSiteContent();const page=content.pages.products;return <InnerHero active="/products" {...page}><ProductBrowser products={content.products}/><CustomContentBlocks blocks={content.customBlocks.products}/><InjectionLayer content={content} page="products"/></InnerHero>}
