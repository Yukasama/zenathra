import Link from "next/link";
import StockPortfolioAddButton from "./stock-portfolio-add-button";
import { StructureProps } from "@/types/layout";
import React from "react";
import type { Session } from "next-auth";
import { ChevronsDown, ChevronsUp } from "lucide-react";
import { getQuote } from "@/lib/fmp/quote";
import { StockImage } from "./stock-image";
import { Stock } from "@prisma/client";
import { db } from "@/lib/db";
import { Card } from "./ui/card";

function Structure({ className, isLoading, children }: StructureProps) {
  return (
    <div
      className={`${
        isLoading && "animate-pulse-right"
      } flex h-[90px] w-[350px] animate-appear-up items-center gap-3 rounded-lg bg-slate-200 p-2 px-4 dark:bg-zinc-400 ${className}`}>
      {children}
    </div>
  );
}

export function StockPrice2Loading({ className }: StructureProps) {
  return <Structure className={className} isLoading />;
}

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  session: Session | null;
  stock: Stock;
}

export default async function StockPrice2({ session, stock }: Props) {
  const [quote, portfolios] = await Promise.all([
    getQuote(stock.symbol),
    db.portfolio.findMany({
      where: { creatorId: session?.user.id },
    }),
  ]);

  const portfoliosWithStocks = await Promise.all(
    portfolios.map(async (portfolio) => ({
      ...portfolio,
      stockIds: await db.stockInPortfolio.findMany({
        select: { stockId: true },
        where: { portfolioId: portfolio.id },
      }),
    }))
  );

  const flattenedPortfolios = portfoliosWithStocks.map((portfolio) => ({
    ...portfolio,
    stockIds: portfolio.stockIds.map((stock) => stock.stockId),
  }));

  const positive =
    quote && quote.change ? (quote.change > 0 ? true : false) : true;

  return (
    <Card className="f-col p-3 pb-1.5 gap-1">
      <div className="flex gap-2">
        <Link href={stock.website ?? null} prefetch={false} target="_blank">
          <StockImage src={stock.image} px={40} />
        </Link>
        <div className="-space-y-1">
          <p className="mr-10 w-[200px] truncate text-[17px] font-medium">
            {stock.symbol}
          </p>
          <p className="text-slate-400 text-[13px]">{stock.companyName}</p>
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
        <StockPortfolioAddButton
          session={session}
          symbolId={stock.id}
          symbol={stock.symbol}
          portfolios={flattenedPortfolios}
        />
      </div>
    </Card>
  );
}
