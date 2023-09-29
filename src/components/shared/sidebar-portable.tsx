import SidebarPortableClient from "./sidebar-portable-client";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import _ from "lodash";

export default async function SidebarPortable() {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  const recentStocks = await db.userRecentStocks.findMany({
    select: {
      stock: {
        select: {
          symbol: true,
          image: true,
          companyName: true,
        },
      },
    },
    where: { userId: user?.id ?? undefined },
    take: 10,
  });

  const uniqueStocks = _.uniqBy(recentStocks, "stock.symbol");

  return <SidebarPortableClient user={user} recentStocks={uniqueStocks} />;
}
