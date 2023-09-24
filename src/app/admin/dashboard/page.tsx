import AdminAddStocks from "@/components/admin-add-stocks";
import PageLayout from "@/components/shared/page-layout";
import { site } from "@/config/site";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export const metadata = {
  title: `Stock Dashboard - ${site.name}`,
};

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
