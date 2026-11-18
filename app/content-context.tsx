"use client";
import { createContext, useContext } from "react";
import type { SiteContent } from "../lib/site-content";

export type SiteClientContent = Pick<SiteContent,"general"|"home"|"international"> & {
  products: Pick<SiteContent["products"][number],"slug"|"fa"|"en">[];
  productCategories: Pick<SiteContent["productCategories"][number],"id"|"fa">[];
  blogPosts: Pick<SiteContent["blogPosts"][number],"slug"|"title">[];
};
const SiteContentContext=createContext<SiteClientContent|null>(null);
export function SiteContentProvider({content,children}:{content:SiteClientContent;children:React.ReactNode}){return <SiteContentContext.Provider value={content}>{children}</SiteContentContext.Provider>}
export function useSiteContent(){const value=useContext(SiteContentContext);if(!value)throw new Error("SiteContentProvider is missing");return value}
