import AdminAddStocks from "@/components/admin-add-stocks";
import AdminCleanDatabase from "@/components/admin-clean-database";
import Error from "next/error";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function page() {
  const session = await getAuthSession();

  const user = await db.user.findFirst({
    where: { id: session?.user.id },
  });

  if (user?.role !== "admin") return Error;

  return (
    <div className="flex gap-5 p-3 px-6">
      <AdminAddStocks />
      <AdminCleanDatabase />
    </div>
  );
}
