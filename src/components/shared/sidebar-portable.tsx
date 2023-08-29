import { getAuthSession } from "@/lib/auth";
import SidebarPortableClient from "./sidebar-portable-client";

export default async function SidebarPortable() {
  const session = await getAuthSession();

  return <SidebarPortableClient session={session} />;
}
