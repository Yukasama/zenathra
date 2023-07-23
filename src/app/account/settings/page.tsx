import Settings from "@/components/routes/account/settings/Settings";
import { getUser } from "@/lib/user";

export default async function SettingsPage() {
  const user = await getUser();

  return <Settings user={user} />;
}
