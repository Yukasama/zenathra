import AdminAddStocks from "@/app/admin/dashboard/admin-add-stocks";
import PageLayout from "@/components/shared/page-layout";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export const metadata = { title: "Admin Dashboard" };
export const runtime = "edge";

export default async function page() {
  const { getPermission } = getKindeServerSession();
  const permissions = await getPermission("(upload:stocks)");

  if (!permissions.isGranted) {
    redirect("/");
  }

  return (
    <PageLayout
      title="Stock Dashboard"
      description="Manage stock entries in the database">
      <AdminAddStocks />
    </PageLayout>
  );
}
