import AdminAddStocks from "@/components/admin-add-stocks";
import PageLayout from "@/components/shared/page-layout";

export default async function page() {
  return (
    <PageLayout>
      <AdminAddStocks />
    </PageLayout>
  );
}
