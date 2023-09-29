import AdminAddStocks from "@/components/admin-add-stocks";
import PageLayout from "@/components/shared/page-layout";
import { site } from "@/config/site";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: `Stock Dashboard - ${site.name}`,
};

export default async function page() {
  const { getPermission } = getKindeServerSession();

  if (!getPermission("upload:stocks").isGranted) redirect("/");

  return (
    <PageLayout
      title="Stock Dashboard"
      description="Manage stock entries in the database">
      <AdminAddStocks />
    </PageLayout>
  );
}
