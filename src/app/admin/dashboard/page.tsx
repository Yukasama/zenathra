import PageLayout from "@/components/shared/page-layout";
import { db } from "@/db";
import { getUser } from "@/lib/auth";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

const AdminAddStocks = dynamic(
  () => import("@/app/admin/dashboard/admin-add-stocks"),
  { ssr: false }
);

export const metadata = { title: "Admin Dashboard" };
// export const runtime = "edge";

export default async function page() {
  const user = await getUser();

  const dbUser = await db.user.findFirst({
    select: { role: true },
    where: { id: user?.id },
  });

  if (!dbUser?.role) redirect("/");

  return (
    <PageLayout
      title="Stock Dashboard"
      description="Manage stock entries in the database">
      <AdminAddStocks />
    </PageLayout>
  );
}
