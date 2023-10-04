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
import { db } from "@/db";
import { buttonVariants } from "../ui/button";
import { BarChart } from "lucide-react";
import PortfolioAddModal from "./portfolio-add-modal";

interface Props {
  portfolio: Pick<
    PortfolioWithStocks,
    "id" | "title" | "public" | "color" | "stocks"
  >;
}

export default async function PortfolioCard({ portfolio }: Props) {
  const symbols = await db.stock.findMany({
    select: { symbol: true },
    where: { id: { in: portfolio.stocks } },
  });

  return (
    <Card className="f-col justify-between min-h-72">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 f-box rounded-full border text-lg"
              style={{
                backgroundColor: portfolio.color ?? "#000",
              }}>
              {portfolio.title[0].toUpperCase()}
            </div>
            <div>
              <CardTitle>{portfolio.title}</CardTitle>
              <CardDescription>
                {portfolio.public ? "Public" : "Private"}
              </CardDescription>
            </div>
          </div>
          <PortfolioAddModal portfolio={portfolio} />
        </div>
      </CardHeader>
      <CardContent>
        <Suspense
          fallback={[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse-right h-12 p-2 mb-2" />
          ))}>
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
          <BarChart className="h-4 w-4" />
          View
        </Link>
        <PortfolioDeleteModal portfolio={portfolio} />
      </CardFooter>
    </Card>
  );
}
