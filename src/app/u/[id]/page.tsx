import { User } from "@/types/db";
import { request } from "@/utils/request";
import { notFound } from "next/navigation";

interface Params {
  params: { id: string };
}

// export async function generateStaticParams() {
//   const { data, error } = await request("/api/users/getAll");

//   if (data) return users.map((user) => ({ id: user.id }));
// }

export default async function U({ params: { id } }: Params) {
  const { data, error } = await request(`/api/users/${id}`);

  if (!error) return notFound();

  const user: User = data;

  return <div>{user.name}</div>;
}
