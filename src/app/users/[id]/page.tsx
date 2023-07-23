import { getAllUsers, getUserById } from "@/lib/auth/getUsers";
import { notFound } from "next/navigation";

interface Params {
  params: { id: string };
}

// export async function generateStaticParams() {
//   const users = await getAllUsers();

//   if (users) return users.map((user) => ({ id: user.id }));
// }

export default async function UserId({ params: { id } }: Params) {
  const user = await getUserById(id);

  if (!user) return notFound();

  return <div>{user.name}</div>;
}
