import { authenticatedSignOutPath } from "../chatgpt-auth";
import { requireAdminPage } from "../../lib/admin-auth";
import { getDraftSiteContent, getSiteContent, stripCodeInjections } from "../../lib/site-content";
import { AdminEditor } from "./admin-editor";
import { listAdminMembers } from "../../lib/admin-users";
import type { Metadata } from "next";

export const dynamic="force-dynamic";
export const metadata:Metadata={robots:{index:false,follow:false},title:"پنل مدیریت"};

export default async function AdminPage(){
  const user=await requireAdminPage();
  const [content,publishedContent,admins]=await Promise.all([
    getDraftSiteContent(),
    getSiteContent(),
    user.member.role==="owner"?listAdminMembers():Promise.resolve([user.member]),
  ]);
  const editorContent=user.member.role==="owner"?content:stripCodeInjections(content);
  return <AdminEditor initialContent={editorContent} initialHasUnpublishedDraft={JSON.stringify(content)!==JSON.stringify(publishedContent)} initialAdmins={admins} currentAdmin={user.member} user={user.displayName} signOut={authenticatedSignOutPath(user.authProvider,"/")}/>;
}
