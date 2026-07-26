import { NextResponse } from "next/server";
import { createRfqSubmission } from "../../../lib/rfq";

export async function POST(request:Request){
  try{
    const length=Number(request.headers.get("content-length")||0);
    if(length>20_000)return NextResponse.json({error:"حجم درخواست بیش از حد مجاز است"},{status:413});
    const body=await request.json() as Record<string,unknown>;
    const result=await createRfqSubmission(body,request);
    return NextResponse.json({ok:true,...result},{status:201,headers:{"Cache-Control":"no-store"}});
  }catch(error){
    return NextResponse.json({error:error instanceof Error?error.message:"ثبت درخواست انجام نشد"},{status:400,headers:{"Cache-Control":"no-store"}});
  }
}
