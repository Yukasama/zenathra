import AccountSettings from "@/components/account-settings";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default function page() {
  const user = getUser();

  if (!user) redirect("/");

  return <AccountSettings user={user} />;
}
