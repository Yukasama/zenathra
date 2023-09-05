import PageLayout from "@/components/page-layout";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

export async function generateStaticParams() {
  const users = await db.user.findMany({
    select: { id: true },
  });

  return users.map((user) => ({ id: user.id }));
}

export default async function page({ params: { id } }: Props) {
  const session = await getAuthSession();
  const user = await db.user.findFirst({
    where: { id },
  });

  if (!user) return notFound();

  return (
    <PageLayout
      title="My Profile"
      description="This page will be visible to everyone">
      <p>{session?.user.email}</p>
    </PageLayout>
  );
}
