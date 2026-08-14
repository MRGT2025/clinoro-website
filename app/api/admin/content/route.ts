import { NextResponse } from "next/server";
import { getAuthorizedAdmin } from "../../../../lib/admin-auth";
import { publishContentRevision } from "../../../../lib/content-revisions";
import { getDraftSiteContent, getSiteContent, normalizeSiteContent, saveDraftSiteContent, stripCodeInjections, type SiteContent } from "../../../../lib/site-content";

export async function GET(request:Request){
  const admin=await getAuthorizedAdmin();
  if(!admin) return NextResponse.json({error:"Unauthorized"},{status:401});
  const mode=new URL(request.url).searchParams.get("mode");
  const content=mode==="draft"?await getDraftSiteContent():await getSiteContent();
  return NextResponse.json(admin.member.role==="owner"?content:stripCodeInjections(content));
}

export async function PUT(request:Request){
  const admin=await getAuthorizedAdmin();
  if(!admin) return NextResponse.json({error:"Unauthorized"},{status:401});
  const payload=await request.json().catch(()=>null) as SiteContent|{content:SiteContent;mode?:"draft"|"publish";note?:string}|null;
  if(!payload||typeof payload!=="object")return NextResponse.json({error:"Invalid content"},{status:400});
  const wrapped="content" in payload;
  const submitted=wrapped?payload.content:payload;
  const mode=wrapped&&payload.mode==="draft"?"draft":"publish";
  const note=wrapped?payload.note||"":"";
  if(!submitted?.general?.brand||!submitted?.home?.title||!Array.isArray(submitted.products)) return NextResponse.json({error:"Invalid content"},{status:400});
  const body=normalizeSiteContent(submitted);
  if(admin.member.role!=="owner"){
    const protectedContent=mode==="draft"?await getDraftSiteContent():await getSiteContent();
    body.injections=protectedContent.injections;
    const currentTrust=new Map(protectedContent.trustItems.map(item=>[item.id,item]));
    const submittedTrust=(body.trustItems||[]).map(item=>{
      const saved=currentTrust.get(item.id);
      return saved?.verified?saved:{...item,verified:false,published:false};
    });
    const protectedItems=protectedContent.trustItems.filter(item=>item.verified&&!submittedTrust.some(candidate=>candidate.id===item.id));
    body.trustItems=[...submittedTrust,...protectedItems];
  }
  if(mode==="draft"){
    await saveDraftSiteContent(body);
    return NextResponse.json({ok:true,mode,updatedAt:new Date().toISOString()});
  }
  const revision=await publishContentRevision(body,admin.member.email,note||"انتشار از پنل مدیریت");
  return NextResponse.json({ok:true,mode,revisionId:revision.id,updatedAt:new Date(revision.createdAt).toISOString()});
}
