import { NextResponse } from "next/server";
import { getAuthorizedAdmin } from "../../../../lib/admin-auth";
import { listRfqSubmissions, updateRfqStatus } from "../../../../lib/rfq";

export async function GET(request:Request){
  if(!await getAuthorizedAdmin())return NextResponse.json({error:"Unauthorized"},{status:401});
  const status=new URL(request.url).searchParams.get("status")||undefined;
  return NextResponse.json({submissions:await listRfqSubmissions(status)},{headers:{"Cache-Control":"no-store"}});
}

export async function PATCH(request:Request){
  if(!await getAuthorizedAdmin())return NextResponse.json({error:"Unauthorized"},{status:401});
  try{
    const body=await request.json() as {id?:string;status?:string};
    await updateRfqStatus(body.id||"",body.status||"");
    return NextResponse.json({ok:true});
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:"خطا در تغییر وضعیت"},{status:400})}
}
