import { Portfolio } from "@prisma/client";
import Link from "next/link";
import PortfolioDeleteButton from "./portfolio-delete-button";
import StockList, { StockListLoading } from "./stock-list";
import { Suspense } from "react";

interface Props {
  portfolio: Pick<Portfolio, "id" | "title" | "public">;
  stockIds: string[];
}

export default function PortfolioCard({ portfolio, stockIds }: Props) {
  return (
    <div className="relative">
      <Link
        href={`/portfolios/${portfolio.id}`}
        className="f-col group min-h-[300px] p-5 box hover:bg-slate-200 dark:hover:bg-moon-800">
        <p className="text-lg font-medium">{portfolio.title}</p>
        <div>
          <Suspense fallback={<StockListLoading limit={3} />}>
            <StockList
              stockIds={stockIds}
              error="No Stocks in Portfolio"
              className="group-hover:scale-[1.01] duration-300"
              limit={3}
            />
          </Suspense>
        </div>
      </Link>
      <div className="absolute bottom-5 right-5">
        <PortfolioDeleteButton
          portfolio={{
            id: portfolio.id,
            title: portfolio.title,
          }}
        />
      </div>
    </div>
  );
}
