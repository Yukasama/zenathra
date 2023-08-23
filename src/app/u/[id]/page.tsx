import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

// export async function generateStaticParams() {
//   const users = await db.user.findMany();

//   if (users) return users.map((user) => ({ id: user.id }));
// }

export default async function page({ params: { id } }: Props) {
  const user = await db.user.findFirst({
    where: { id },
  });

  if (!user) return notFound();

  return <div>{user.name}</div>;
}
