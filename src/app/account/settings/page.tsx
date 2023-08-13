import { AccountSettings } from "@/components";
import { getUser } from "@/lib/user";

export default async function SettingsPage() {
  const user = await getUser();

  return <AccountSettings user={user} />;
}
