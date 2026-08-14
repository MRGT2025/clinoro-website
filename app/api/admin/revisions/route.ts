import { NextResponse } from "next/server";
import { getAuthorizedAdmin } from "../../../../lib/admin-auth";
import { getContentRevision, listContentRevisions } from "../../../../lib/content-revisions";
import { stripCodeInjections } from "../../../../lib/site-content";

export async function GET(){
  if(!await getAuthorizedAdmin())return NextResponse.json({error:"Unauthorized"},{status:401});
  return NextResponse.json({revisions:await listContentRevisions()});
}

export async function POST(request:Request){
  const admin=await getAuthorizedAdmin();
  if(!admin)return NextResponse.json({error:"Unauthorized"},{status:401});
  const body=await request.json() as {id?:string};
  if(!body.id)return NextResponse.json({error:"Revision id is required"},{status:400});
  const content=await getContentRevision(body.id);
  if(!content)return NextResponse.json({error:"Revision not found"},{status:404});
  return NextResponse.json({content:admin.member.role==="owner"?content:stripCodeInjections(content)});
}
