import { Portfolio } from "@prisma/client";
import Link from "next/link";
import StockList, { StockListLoading } from "./stock-list";
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

interface Props {
  portfolio: Pick<Portfolio, "id" | "title" | "public">;
  stockIds: string[];
}

export default function PortfolioCard({ portfolio, stockIds }: Props) {
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
          <Suspense fallback={<StockListLoading limit={3} />}>
            <StockList
              stockIds={stockIds}
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
