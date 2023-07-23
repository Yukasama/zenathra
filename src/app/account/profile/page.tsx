import { getUser } from "@/lib/user";

export default async function Profile() {
  const user = await getUser();

  return (
    <div>
      <p>Profile</p>
      <p>{user?.email}</p>
    </div>
  );
}
