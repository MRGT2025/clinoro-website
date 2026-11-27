import { NextResponse } from "next/server";
import { createRfqSubmission } from "../../../lib/rfq";
import { assertSameOrigin, readJsonBody, errorResponse } from "../../../lib/http-security";

export async function POST(request:Request){
  try{
    assertSameOrigin(request);
    const body=await readJsonBody(request, 20_000);
    const result=await createRfqSubmission(body,request);
    return NextResponse.json({ok:true,...result},{status:201,headers:{"Cache-Control":"no-store"}});
  }catch(error){
    return errorResponse(error);
  }
}
