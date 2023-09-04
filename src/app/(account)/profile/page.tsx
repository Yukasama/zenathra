import { getAuthSession } from "@/lib/auth";

export default async function page() {
  const session = await getAuthSession();

  return (
    <div>
      <p>Profile</p>
      <p>{session?.user.email}</p>
    </div>
  );
}
