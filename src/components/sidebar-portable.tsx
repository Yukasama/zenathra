import SidebarPortableClient from "./sidebar-portable-client";
import { getServerSession } from "next-auth";

export default async function SidebarPortable() {
  const session = await getServerSession();

  return <SidebarPortableClient session={session} />;
}
