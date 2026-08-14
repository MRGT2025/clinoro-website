import { InnerHero } from "../inner-components";
import { ProductBrowser } from "./product-browser";
import { getSiteContent } from "../../lib/site-content";
import { CustomContentBlocks } from "../custom-content";
import { InjectionLayer } from "../injection-layer";
import { pageMetadata } from "../../lib/seo";
export const generateMetadata=()=>pageMetadata("products");

export default async function ProductsPage(){const content=await getSiteContent();const page=content.pages.products;const itemList={"@context":"https://schema.org","@type":"ItemList",name:"کاتالوگ تجهیزات پزشکی Clinoro",itemListOrder:"https://schema.org/ItemListUnordered",numberOfItems:content.products.length,itemListElement:content.products.map((product,index)=>({"@type":"ListItem",position:index+1,url:`https://clinoromedical.com/products/${product.slug}`,name:product.fa,item:{"@type":"Product",name:product.fa,alternateName:product.en,description:product.summary,category:product.tag}}))};return <InnerHero active="/products" {...page}><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(itemList)}}/><ProductBrowser products={content.products}/><CustomContentBlocks blocks={content.customBlocks.products}/><InjectionLayer content={content} page="products"/></InnerHero>}
