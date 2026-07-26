import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const sourceDirectory=process.argv[2];
const destination=process.argv[3];

if(!sourceDirectory||!destination){
  throw new Error("Usage: node scripts/import-v35-blogs.mjs <source-directory> <destination>");
}

const articles=[
  {
    file:"blog-mhra-device-registration-2026.html",
    slug:"mhra-device-registration-2026",
    image:"mhra-device-registration-2026.jpg",
    publishedAt:"2026-07-24",
  },
  {
    file:"blog-who-wla-medical-devices-2026.html",
    slug:"who-wla-medical-devices-2026",
    image:"who-wla-medical-devices-2026.jpg",
    publishedAt:"2026-07-24",
  },
  {
    file:"blog-human-factors-medical-devices-2026.html",
    slug:"human-factors-medical-devices-2026",
    image:"human-factors-2026.jpg",
    publishedAt:"2026-07-23",
  },
  {
    file:"blog-medical-device-recall-readiness-2026.html",
    slug:"medical-device-recall-readiness-2026",
    image:"recall-readiness-2026.jpg",
    publishedAt:"2026-07-23",
  },
];

function decodeEntities(value){
  return value
    .replace(/&#(\d+);/g,(_,code)=>String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi,(_,code)=>String.fromCodePoint(Number.parseInt(code,16)))
    .replaceAll("&nbsp;"," ")
    .replaceAll("&amp;","&")
    .replaceAll("&quot;",'"')
    .replaceAll("&#39;","'")
    .replaceAll("&lt;","<")
    .replaceAll("&gt;",">");
}

function plainText(value){
  return decodeEntities(
    value
      .replace(/<br\s*\/?>/gi,"\n")
      .replace(/<[^>]+>/g," "),
  )
    .replace(/[ \t]+/g," ")
    .replace(/\s*\n\s*/g,"\n")
    .trim();
}

function capture(html,pattern,label){
  const match=html.match(pattern);
  if(!match)throw new Error(`Could not extract ${label}`);
  return match[1];
}

function listToText(fragment,ordered){
  const items=Array.from(fragment.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi),match=>plainText(match[1]));
  return items.map((item,index)=>ordered?`${index+1}. ${item}`:`- ${item}`).join("\n");
}

function articleToText(fragment){
  let value=fragment;
  value=value.replace(/<div[^>]*class="[^"]*(?:article-callout|article-quote)[^"]*"[^>]*>([\s\S]*?)<\/div>/gi,(_,content)=>`\n\n> ${plainText(content)}\n\n`);
  value=value.replace(/<div[^>]*class="[^"]*source-list[^"]*"[^>]*>[\s\S]*?<\/div>/gi,"");
  value=value.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi,(_,content)=>`\n\n${listToText(content,true)}\n\n`);
  value=value.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi,(_,content)=>`\n\n${listToText(content,false)}\n\n`);
  value=value.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi,(_,content)=>`\n\n## ${plainText(content)}\n\n`);
  value=value.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi,(_,content)=>`\n\n### ${plainText(content)}\n\n`);
  value=value.replace(/<p[^>]*class="[^"]*article-disclaimer[^"]*"[^>]*>([\s\S]*?)<\/p>/gi,(_,content)=>`\n\n> ${plainText(content)}\n\n`);
  value=value.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi,(_,content)=>`\n\n${plainText(content)}\n\n`);
  value=value.replace(/<[^>]+>/g," ");
  return decodeEntities(value)
    .replace(/[ \t]+\n/g,"\n")
    .replace(/\n[ \t]+/g,"\n")
    .replace(/[ \t]{2,}/g," ")
    .replace(/\n{3,}/g,"\n\n")
    .trim();
}

function extractSources(html){
  const sources=[];
  const seen=new Set();
  for(const match of html.matchAll(/<a[^>]+href="(https?:\/\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)){
    const url=decodeEntities(match[1]);
    if(seen.has(url))continue;
    seen.add(url);
    sources.push({title:plainText(match[2]).replace(/^منبع رسمی:\s*/,""),url});
  }
  return sources;
}

const posts=[];
for(const article of articles){
  const html=await readFile(path.join(sourceDirectory,article.file),"utf8");
  const title=plainText(capture(html,/<h1[^>]*>([\s\S]*?)<\/h1>/i,"title"));
  const excerpt=decodeEntities(capture(html,/<meta\s+name="description"\s+content="([^"]*)"/i,"description")).trim();
  const category=plainText(capture(html,/<span[^>]*class="eyebrow"[^>]*>([\s\S]*?)<\/span>/i,"category"));
  const body=capture(html,/<article[^>]*class="[^"]*article-body[^"]*"[^>]*>([\s\S]*?)<\/article>/i,"article body");
  posts.push({
    id:`clinoro-v35-${article.slug}`,
    slug:article.slug,
    title,
    excerpt,
    content:articleToText(body),
    image:`/assets/blog/${article.image}`,
    category,
    author:"تحریریه Clinoro",
    publishedAt:article.publishedAt,
    published:true,
    seoTitle:`${title} | Clinoro`,
    seoDescription:excerpt,
    sources:extractSources(html),
    imageCredit:"",
    imageSource:"",
  });
}

const output=`/* Generated from the static Clinoro V35 articles. */\nexport const v35BlogPosts=${JSON.stringify(posts,null,2)};\n`;
await writeFile(destination,output,"utf8");
console.log(`Imported ${posts.length} Clinoro V35 blog posts.`);
