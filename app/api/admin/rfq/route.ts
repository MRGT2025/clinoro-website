import { NextResponse } from "next/server";
import { getAuthorizedAdmin } from "../../../../lib/admin-auth";
import { listRfqSubmissions, updateRfqStatus } from "../../../../lib/rfq";
import { assertSameOrigin, readJsonBody, errorResponse, SMALL_JSON_BYTES } from "../../../../lib/http-security";

export async function GET(request:Request){
  if(!await getAuthorizedAdmin())return NextResponse.json({error:"Unauthorized"},{status:401});
  const status=new URL(request.url).searchParams.get("status")||undefined;
  return NextResponse.json({submissions:await listRfqSubmissions(status)},{headers:{"Cache-Control":"no-store"}});
}

export async function PATCH(request:Request){
  if(!await getAuthorizedAdmin())return NextResponse.json({error:"Unauthorized"},{status:401});
  try{
    assertSameOrigin(request);
    const body=await readJsonBody(request, SMALL_JSON_BYTES) as {id?:string;status?:string};
    if(typeof body.id!=="string"||typeof body.status!=="string")return NextResponse.json({error:"Invalid request details"},{status:400});
    await updateRfqStatus(body.id||"",body.status||"");
    return NextResponse.json({ok:true});
  }catch(error){return errorResponse(error)}
}
