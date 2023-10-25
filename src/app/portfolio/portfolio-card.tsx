import Link from "next/link";
import StockList from "../../components/stock/stock-list";
import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { PortfolioWithStocks } from "@/types/db";
import { db } from "@/db";
import { Button, buttonVariants } from "../../components/ui/button";
import { BarChart, Plus, Trash } from "lucide-react";
import dynamic from "next/dynamic";
import PortfolioImage from "../../components/portfolio/portfolio-image";

const PortfolioAddModal = dynamic(
  () => import("../../components/portfolio/portfolio-add-modal"),
  {
    ssr: false,
    loading: () => (
      <Button variant="subtle" isLoading>
        <Plus className="h-4 w-4" />
        Add Stocks
      </Button>
    ),
  }
);

const PortfolioDeleteModal = dynamic(
  () => import("../../components/portfolio/portfolio-delete-modal"),
  {
    ssr: false,
    loading: () => (
      <Button variant="destructive" isLoading>
        <Trash className="h-4 w-4" />
        Delete
      </Button>
    ),
  }
);

interface Props {
  portfolio: Pick<
    PortfolioWithStocks,
    "id" | "title" | "public" | "color" | "stocks"
  >;
}

export default async function PortfolioCard({ portfolio }: Props) {
  const symbols = await db.stock.findMany({
    select: { symbol: true },
    where: {
      id: {
        in: portfolio.stocks.map((stock) => stock.stockId),
      },
    },
  });

  return (
    <Card className="min-h-72">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PortfolioImage portfolio={portfolio} />
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
        <Suspense fallback={<p>Loading...</p>}>
          <PortfolioDeleteModal portfolio={portfolio} />
        </Suspense>
      </CardFooter>
    </Card>
  );
}
