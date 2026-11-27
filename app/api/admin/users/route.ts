import { NextResponse } from "next/server";
import { getAuthorizedAdmin } from "../../../../lib/admin-auth";
import { addAdminMember, listAdminMembers, removeAdminMember } from "../../../../lib/admin-users";
import { assertSameOrigin, readJsonBody, errorResponse, SMALL_JSON_BYTES } from "../../../../lib/http-security";

export async function GET(){
  const admin=await getAuthorizedAdmin();
  if(!admin) return NextResponse.json({error:"Unauthorized"},{status:401});
  if(admin.member.role!=="owner")return NextResponse.json({error:"Forbidden"},{status:403});
  return NextResponse.json({admins:await listAdminMembers()});
}

export async function POST(request:Request){
  const admin=await getAuthorizedAdmin();
  if(!admin) return NextResponse.json({error:"Unauthorized"},{status:401});
  if(admin.member.role!=="owner")return NextResponse.json({error:"Forbidden"},{status:403});
  try{
    assertSameOrigin(request);
    const body=await readJsonBody(request, SMALL_JSON_BYTES) as {email?:string;username?:string};
    if((body.email!==undefined&&typeof body.email!=="string")||(body.username!==undefined&&typeof body.username!=="string"))return NextResponse.json({error:"Invalid member details"},{status:400});
    const member=await addAdminMember({email:body.email??"",username:body.username??"",createdBy:admin.email});
    return NextResponse.json({member},{status:201});
  }catch(error){
    return errorResponse(error);
  }
}

export async function DELETE(request:Request){
  const admin=await getAuthorizedAdmin();
  if(!admin) return NextResponse.json({error:"Unauthorized"},{status:401});
  if(admin.member.role!=="owner")return NextResponse.json({error:"Forbidden"},{status:403});
  try{
    assertSameOrigin(request);
    const body=await readJsonBody(request, SMALL_JSON_BYTES) as {email?:string};
    if(body.email!==undefined&&typeof body.email!=="string")return NextResponse.json({error:"Invalid member details"},{status:400});
    await removeAdminMember(body.email??"",admin.email);
    return NextResponse.json({ok:true});
  }catch(error){
    return errorResponse(error);
  }
}
