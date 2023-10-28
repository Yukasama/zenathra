import { db } from "@/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import type { KindeUser } from "@kinde-oss/kinde-auth-nextjs/server";
import StockListItem from "../../../components/stock/stock-list-item";
import { getQuotes } from "@/lib/fmp/quote";
import _ from "lodash";

interface Props {
  user: Pick<KindeUser, "id">;
}

export default async function RecentStocks({ user }: Props) {
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
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  if (!recentStocks || !recentStocks.length)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Stocks</CardTitle>
          <CardDescription>Stocks that were recently viewed</CardDescription>
        </CardHeader>
        <CardContent className="f-box">
          <p className="text-lg text-zinc-400">No stocks explored yet.</p>
        </CardContent>
      </Card>
    );

  const uniqueStocks = _.uniqBy(recentStocks, "stock.symbol");

  const quotes = await getQuotes(recentStocks.map(({ stock }) => stock.symbol));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Stocks</CardTitle>
        <CardDescription>Stocks that were recently viewed</CardDescription>
      </CardHeader>
      <CardContent>
        {uniqueStocks.map(({ stock }) => (
          <StockListItem
            key={stock.symbol}
            stock={stock}
            quote={quotes?.find((q) => q.symbol === stock.symbol)}
          />
        ))}
      </CardContent>
    </Card>
  );
}
