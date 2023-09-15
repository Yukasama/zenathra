import Link from "next/link";
import StockList from "../stock/stock-list";
import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import PortfolioDeleteModal from "./portfolio-delete-modal";
import { PortfolioWithStocks } from "@/types/db";
import { db } from "@/lib/db";
import { buttonVariants } from "../ui/button";
import { BarChart } from "lucide-react";

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
    <Card className="f-col justify-between">
      <CardHeader>
        <CardTitle>{portfolio.title}</CardTitle>
        <CardDescription>
          {portfolio.public ? "Public" : "Private"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<p>Loading...</p>}>
          {/* @ts-expect-error Server Component */}
          <StockList
            symbols={symbols.map((s) => s.symbol)}
            error="No Stocks in this Portfolio"
            className="group-hover:scale-[1.01] duration-300 border-none"
            limit={3}
          />
        </Suspense>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link
          href={`/p/${portfolio.id}`}
          className={buttonVariants({ variant: "subtle" })}>
          <BarChart className="h-4" />
          View
        </Link>
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
