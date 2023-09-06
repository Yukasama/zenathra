import AdminAddStocks from "@/components/admin-add-stocks";
import PageLayout from "@/components/page-layout";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function page() {
  const session = await getAuthSession();

  const user = await db.user.findFirst({
    select: { role: true },
    where: { id: session?.user?.id },
  });

  if (user?.role !== "admin") redirect("/");

  return (
    <PageLayout
      title="Stock Dashboard"
      description="Manage stock entries in the database">
      <AdminAddStocks />
    </PageLayout>
  );
}
