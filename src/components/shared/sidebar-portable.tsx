import { getAuthSession } from "@/lib/auth";
import SidebarPortableClient from "./sidebar-portable-client";
import { db } from "@/lib/db";
import _ from "lodash";

export default async function SidebarPortable() {
  const session = await getAuthSession();

  const [user, recentStocks] = await Promise.all([
    db.user.findFirst({
      select: { role: true },
      where: { id: session?.user?.id },
    }),
    db.userRecentStocks.findMany({
      select: {
        stock: { select: { symbol: true, image: true, companyName: true } },
      },
      where: { userId: session?.user?.id },
      take: 10,
    }),
  ]);

  const uniqueStocks = _.uniqBy(recentStocks, "stock.symbol");

  return <SidebarPortableClient user={user} recentStocks={uniqueStocks} />;
}
