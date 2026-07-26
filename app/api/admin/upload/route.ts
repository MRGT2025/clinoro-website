import { NextResponse } from "next/server";
import { getAuthorizedAdmin } from "../../../../lib/admin-auth";
import { ensureDatabase, getD1, getMediaBucket } from "../../../../db";

const IMAGE_TYPES=new Set(["image/jpeg","image/png","image/webp","image/gif","image/avif"]);
const VIDEO_TYPES=new Set(["video/mp4","video/webm","video/quicktime"]);
const DOCUMENT_TYPES=new Set(["application/pdf"]);

export async function POST(request:Request){
  if(!await getAuthorizedAdmin()) return NextResponse.json({error:"Unauthorized"},{status:401});
  const form=await request.formData();
  const file=form.get("file");
  if(!(file instanceof File)) return NextResponse.json({error:"No file"},{status:400});
  const maxSize=IMAGE_TYPES.has(file.type)?15*1024*1024:VIDEO_TYPES.has(file.type)?80*1024*1024:DOCUMENT_TYPES.has(file.type)?25*1024*1024:0;
  if(!maxSize||file.size>maxSize) return NextResponse.json({error:"فقط تصویر تا ۱۵، PDF تا ۲۵ یا ویدئو تا ۸۰ مگابایت مجاز است"},{status:400});
  const id=crypto.randomUUID();
  const clean=file.name.replace(/[^a-zA-Z0-9._-]/g,"-").slice(-90)||"image";
  const key=`media/${id}-${clean}`;
  await getMediaBucket().put(key,file.stream(),{httpMetadata:{contentType:file.type}});
  await ensureDatabase();
  await getD1().prepare("INSERT INTO media (id, object_key, filename, content_type, size, created_at) VALUES (?, ?, ?, ?, ?, ?)").bind(id,key,file.name,file.type,file.size,Date.now()).run();
  return NextResponse.json({id,url:`/api/media/${id}`,name:file.name,contentType:file.type});
}
