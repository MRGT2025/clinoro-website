import { NextResponse } from "next/server";
import { getAuthorizedAdmin } from "../../../../lib/admin-auth";
import { ensureDatabase, getD1, getMediaBucket } from "../../../../db";
import { assertSameOrigin, readUploadBody, errorResponse } from "../../../../lib/http-security";
import { validateUpload } from "../../../../lib/upload-security";

export async function POST(request:Request){
  if(!await getAuthorizedAdmin()) return NextResponse.json({error:"Unauthorized"},{status:401});
  try {
  assertSameOrigin(request);
  const form=await readUploadBody(request);
  const file=form.get("file");
  if(!(file instanceof File)) return NextResponse.json({error:"No file"},{status:400});
  await validateUpload(file);
  const id=crypto.randomUUID();
  const clean=file.name.replace(/[^a-zA-Z0-9._-]/g,"-").slice(-90)||"image";
  const key=`media/${id}-${clean}`;
  await getMediaBucket().put(key,file.stream(),{httpMetadata:{contentType:file.type}});
  await ensureDatabase();
  await getD1().prepare("INSERT INTO media (id, object_key, filename, content_type, size, created_at) VALUES (?, ?, ?, ?, ?, ?)").bind(id,key,file.name,file.type,file.size,Date.now()).run();
  return NextResponse.json({id,url:`/api/media/${id}`,name:file.name,contentType:file.type});
  } catch (error) { return errorResponse(error); }
}
