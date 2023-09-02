import Link from "next/link";
import StockList from "./stock-list";
import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import PortfolioDeleteModal from "./portfolio-delete-modal";
import { PortfolioWithStocks } from "@/types/db";
import { db } from "@/lib/db";

interface Props {
  portfolio: Pick<PortfolioWithStocks, "id" | "title" | "public" | "stockIds">;
}

export default async function PortfolioCard({ portfolio }: Props) {
  const symbols = await db.stock.findMany({
    select: { symbol: true },
    where: {
      id: { in: portfolio.stockIds },
    },
  });

  return (
    <Card className="relative f-col justify-between hover:bg-slate-100 dark:hover:bg-slate-900">
      <Link href={`/portfolios/${portfolio.id}`}>
        <CardHeader>
          <CardTitle>{portfolio.title}</CardTitle>
          <CardDescription>
            {portfolio.public ? "Public" : "Private"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<p>Loading...</p>}>
            <StockList
              symbols={symbols.map((s) => s.symbol)}
              error="No Stocks in this Portfolio"
              className="group-hover:scale-[1.01] duration-300"
              limit={3}
            />
          </Suspense>
        </CardContent>
      </Link>
      <CardFooter>
        <PortfolioDeleteModal
          portfolio={{
            id: portfolio.id,
            title: portfolio.title,
          }}
        />
      </CardFooter>
    </Card>
  );
}
