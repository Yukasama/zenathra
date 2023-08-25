import { AdminAddStocks, AdminCleanDatabase } from "@/components";
import Error from "next/error";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function StockControl() {
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
