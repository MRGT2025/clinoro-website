import { NextResponse } from "next/server";
import { getAuthorizedAdmin } from "../../../../lib/admin-auth";
import { getSiteContent, saveSiteContent, type SiteContent } from "../../../../lib/site-content";

export async function GET(){
  if(!await getAuthorizedAdmin()) return NextResponse.json({error:"Unauthorized"},{status:401});
  return NextResponse.json(await getSiteContent());
}

export async function PUT(request:Request){
  const admin=await getAuthorizedAdmin();
  if(!admin) return NextResponse.json({error:"Unauthorized"},{status:401});
  const body=await request.json() as SiteContent;
  if(!body?.general?.brand||!body?.home?.title||!Array.isArray(body.products)) return NextResponse.json({error:"Invalid content"},{status:400});
  if(admin.member.role!=="owner"){
    const current=await getSiteContent();
    body.injections=current.injections;
    const currentTrust=new Map(current.trustItems.map(item=>[item.id,item]));
    const submitted=(body.trustItems||[]).map(item=>{
      const saved=currentTrust.get(item.id);
      return saved?.verified?saved:{...item,verified:false,published:false};
    });
    const protectedItems=current.trustItems.filter(item=>item.verified&&!submitted.some(candidate=>candidate.id===item.id));
    body.trustItems=[...submitted,...protectedItems];
  }
  await saveSiteContent(body);
  return NextResponse.json({ok:true,updatedAt:new Date().toISOString()});
}
