import { getChatGPTUser, requireChatGPTUser } from "../app/chatgpt-auth";
import { notFound } from "next/navigation";
import { getAdminMember } from "./admin-users";

export async function requireAdminPage(){
  const user=await requireChatGPTUser("/admin");
  const member=await getAdminMember(user.email);
  if(!member) notFound();
  return {...user,member};
}

export async function getAuthorizedAdmin(){
  const user=await getChatGPTUser();
  if(!user) return null;
  const member=await getAdminMember(user.email);
  return member?{...user,member}:null;
}
