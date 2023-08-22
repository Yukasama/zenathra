import { AccountSettings } from "@/components";
import { getAuthSession } from "@/lib/auth";

export default async function page() {
  const session = await getAuthSession();

  return <AccountSettings user={session?.user} />;
}
