import { db } from "@/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import StockListItem from "../../../../components/stock/stock-list-item";
import { getQuotes } from "@/lib/fmp/quote";
import { User } from "next-auth";

interface Props {
  user: Pick<User, "id">;
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
    distinct: "stockId",
    take: 5,
  });

  if (!recentStocks.length)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Stocks</CardTitle>
          <CardDescription>Stocks that were recently viewed</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-zinc-400">No stocks explored yet.</p>
        </CardContent>
      </Card>
    );

  const quotes = await getQuotes(recentStocks.map(({ stock }) => stock.symbol));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Stocks</CardTitle>
        <CardDescription>Stocks that were recently viewed</CardDescription>
      </CardHeader>
      <CardContent>
        {recentStocks.map(({ stock }) => (
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
