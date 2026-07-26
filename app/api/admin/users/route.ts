import { NextResponse } from "next/server";
import { getAuthorizedAdmin } from "../../../../lib/admin-auth";
import { addAdminMember, listAdminMembers, removeAdminMember } from "../../../../lib/admin-users";

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
    const body=await request.json() as {email?:string;username?:string};
    const member=await addAdminMember({email:body.email??"",username:body.username??"",createdBy:admin.email});
    return NextResponse.json({member},{status:201});
  }catch(error){
    return NextResponse.json({error:error instanceof Error?error.message:"خطا در افزودن مدیر"},{status:400});
  }
}

export async function DELETE(request:Request){
  const admin=await getAuthorizedAdmin();
  if(!admin) return NextResponse.json({error:"Unauthorized"},{status:401});
  if(admin.member.role!=="owner")return NextResponse.json({error:"Forbidden"},{status:403});
  try{
    const body=await request.json() as {email?:string};
    await removeAdminMember(body.email??"",admin.email);
    return NextResponse.json({ok:true});
  }catch(error){
    return NextResponse.json({error:error instanceof Error?error.message:"خطا در حذف مدیر"},{status:400});
  }
}
