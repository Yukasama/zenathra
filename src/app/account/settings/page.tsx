import AccountSettings from "@/components/account-settings";
import { getAuthSession } from "@/lib/auth";

export default async function page() {
  const session = await getAuthSession();

  return <AccountSettings session={session} />;
}
