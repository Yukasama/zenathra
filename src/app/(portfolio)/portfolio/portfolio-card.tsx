import Link from "next/link";
import StockList from "../../../components/stock/stock-list";
import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { PortfolioWithStocks } from "@/types/db";
import { db } from "@/db";
import { BarChart } from "lucide-react";
import dynamic from "next/dynamic";
import PortfolioImage from "../../../components/portfolio/portfolio-image";
import { SkeletonButton, SkeletonList } from "@/components/ui/skeleton";
import { Button } from "@nextui-org/button";

interface Props {
  portfolio: Pick<
    PortfolioWithStocks,
    "id" | "title" | "isPublic" | "color" | "stocks"
  >;
}

const PortfolioAddModal = dynamic(
  () => import("@/components/portfolio/portfolio-add-modal"),
  {
    ssr: false,
    loading: () => <SkeletonButton />,
  }
);

const PortfolioDeleteModal = dynamic(
  () => import("@/components/portfolio/portfolio-delete-modal"),
  {
    ssr: false,
    loading: () => <SkeletonButton />,
  }
);

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
    <Card className="min-h-72 h-full f-col justify-between">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PortfolioImage portfolio={portfolio} />
            <div>
              <CardTitle>{portfolio.title}</CardTitle>
              <CardDescription>
                {portfolio.isPublic ? "Public" : "Private"}
              </CardDescription>
            </div>
          </div>
          <PortfolioAddModal portfolio={portfolio} />
        </div>
      </CardHeader>

      <CardContent>
        <Suspense fallback={<SkeletonList />}>
          <StockList
            symbols={symbols.map((s) => s.symbol)}
            error="No Stocks in this Portfolio"
            className="group-hover:scale-[1.01] duration-300 border-none"
            limit={3}
          />
        </Suspense>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Link href={`/p/${portfolio.id}`}>
          <Button>
            <BarChart size={18} />
            View
          </Button>
        </Link>
        <PortfolioDeleteModal portfolio={portfolio} />
      </CardFooter>
    </Card>
  );
}
