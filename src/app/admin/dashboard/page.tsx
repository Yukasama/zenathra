import AdminAddStocks from "@/components/admin-add-stocks";
import PageLayout from "@/components/shared/page-layout";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function page() {
  const session = await getAuthSession();

  const user = await db.user.findFirst({
    where: { id: session?.user.id },
  });

  //if (!user || user.role !== "admin") return redirect("/");

  return (
    <PageLayout>
      <AdminAddStocks />
    </PageLayout>
  );
}
