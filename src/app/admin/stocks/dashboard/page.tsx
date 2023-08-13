import { AdminAddStocks, AdminCleanDatabase, Error } from "@/components";
import { getUser } from "@/lib/user";
import { Home } from "react-feather";

export default async function StockControl() {
  const user = await getUser();

  if (!user || user.role !== "admin")
    return (
      <Error
        error="You're not authorized to be here."
        statusCode={403}
        action="home"
        buttonLabel="Return To Home"
        buttonIcon={<Home className="h-4 w-4" />}
      />
    );

  return (
    <div className="flex gap-5 p-3 px-6">
      <AdminAddStocks />
      <AdminCleanDatabase />
    </div>
  );
}
