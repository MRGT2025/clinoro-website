import { authenticatedSignOutPath } from "../chatgpt-auth";
import { requireAdminPage } from "../../lib/admin-auth";
import { getSiteContent } from "../../lib/site-content";
import { AdminEditor } from "./admin-editor";
import { listAdminMembers } from "../../lib/admin-users";
import type { Metadata } from "next";

export const dynamic="force-dynamic";
export const metadata:Metadata={robots:{index:false,follow:false},title:"پنل مدیریت"};

export default async function AdminPage(){
  const user=await requireAdminPage();
  const content=await getSiteContent();
  const admins=user.member.role==="owner"?await listAdminMembers():[user.member];
  return <AdminEditor initialContent={content} initialAdmins={admins} currentAdmin={user.member} user={user.displayName} signOut={authenticatedSignOutPath(user.authProvider,"/")}/>;
}
