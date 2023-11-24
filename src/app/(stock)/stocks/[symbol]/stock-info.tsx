import Link from "next/link";
import React from "react";
import { ChevronsDown, ChevronsUp } from "lucide-react";
import { getQuote } from "@/lib/fmp/quote";
import StockImage from "../../../../components/stock/stock-image";
import { Stock } from "@prisma/client";
import { db } from "@/db";
import { Card } from "../../../../components/ui/card";
import Skeleton from "../../../../components/ui/skeleton";
import { Button, buttonVariants } from "../../../../components/ui/button";
import dynamic from "next/dynamic";
import { getUser } from "@/lib/auth";

const StockPortfolioAddModal = dynamic(
  () => import("../../../../components/stock/stock-portfolio-add-modal"),
  {
    ssr: false,
    loading: () => <Button variant="subtle" size="sm" isLoading />,
  }
);

export function StockInfoLoading() {
  return (
    <Card className="f-col p-3 pb-1.5 gap-1">
      <div className="flex gap-2">
        <Skeleton className="h-10 w-10 rounded-full"></Skeleton>
        <div className="-space-y-1">
          <Skeleton>
            <p className="mr-10 w-[200px] truncate text-[17px] font-medium"></p>
          </Skeleton>
          <Skeleton>
            <p className="text-zinc-400 text-[13px]"></p>
          </Skeleton>
        </div>
      </div>
      <div className="flex items-center gap-1 px-2">
        <Skeleton>
          <div className="flex items-center gap-[1px]">
            <span className="text-lg mb-[1px]">$</span>
            <p className="text-[26px]"></p>
          </div>
        </Skeleton>
      </div>
      <div className="absolute right-3 top-3 flex">
        <Skeleton>
          <div className={buttonVariants()}></div>
        </Skeleton>
      </div>
    </Card>
  );
}

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  stock: Pick<Stock, "id" | "symbol" | "website" | "image" | "companyName">;
}

export default async function StockInfo({ stock }: Props) {
  const user = await getUser();

  const [quote, portfolios] = await Promise.all([
    getQuote(stock.symbol),
    db.portfolio.findMany({
      select: {
        id: true,
        title: true,
        isPublic: true,
        color: true,
        stocks: {
          select: { stockId: true },
        },
      },
      where: { creatorId: user?.id },
    }),
  ]);

  const positive =
    quote && quote.change ? (quote.change > 0 ? true : false) : true;

  return (
    <Card className="f-col p-3 pb-1.5 gap-1">
      <div className="flex gap-2">
        <Link href={stock.website} prefetch={false} target="_blank">
          <StockImage src={stock.image} px={40} />
        </Link>
        <div className="-space-y-1">
          <p className="mr-10 w-[200px] truncate text-[17px] font-medium">
            {stock.symbol}
          </p>
          <p className="text-zinc-400 text-[13px]">{stock.companyName}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 px-2">
        <div className="flex items-center gap-[1px]">
          <span className="text-lg mb-[1px]">$</span>
          <p className="text-[26px]">{quote?.price.toFixed(2) ?? "N/A"}</p>
        </div>
        {positive ? (
          <ChevronsUp className="h-5 w-5 mt-1 text-green-500" />
        ) : (
          <ChevronsDown className="h-5 w-5 mt-1 text-red-500" />
        )}
        <p
          className={`text-lg mt-1.5 ${
            positive ? "text-green-500" : "text-red-500"
          }`}>
          ({positive && "+"}
          {quote?.changesPercentage.toFixed(2) + "%" ?? "N/A"})
        </p>
      </div>
      <div className="absolute right-3 top-3 flex">
        <StockPortfolioAddModal
          isAuthenticated={!!user}
          symbolId={stock.id}
          symbol={stock.symbol}
          portfolios={portfolios}
        />
      </div>
    </Card>
  );
}
