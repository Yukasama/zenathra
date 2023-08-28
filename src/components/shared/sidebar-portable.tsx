import { authOptions } from "@/lib/auth";
import SidebarPortableClient from "./sidebar-portable-client";
import { getServerSession } from "next-auth";

export default async function SidebarPortable() {
  const session = await getServerSession(authOptions);

  return <SidebarPortableClient session={session} />;
}
