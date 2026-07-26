import { ensureDatabase, getD1, getMediaBucket } from "../../../../db";

export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){
  await ensureDatabase();
  const {id}=await params;
  const row=await getD1().prepare("SELECT object_key, content_type FROM media WHERE id = ?").bind(id).first<{object_key:string;content_type:string}>();
  if(!row) return new Response("Not found",{status:404});
  const object=await getMediaBucket().get(row.object_key);
  if(!object) return new Response("Not found",{status:404});
  return new Response(object.body,{headers:{"Content-Type":row.content_type,"Cache-Control":"public, max-age=31536000, immutable","ETag":object.httpEtag}});
}
