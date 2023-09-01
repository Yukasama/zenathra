import Link from "next/link";
import StockPortfolioAddButton from "./stock-portfolio-add-button";
import { StructureProps } from "@/types/layout";
import React from "react";
import type { Session } from "next-auth";
import { ChevronsDown, ChevronsUp } from "lucide-react";
import { getQuote } from "@/lib/fmp/quote";
import { StockImage } from "./shared/stock-image";
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

  const flattenedPortfolios = await Promise.all(
    portfolios.map(async (portfolio) => ({
      ...portfolio,
      stockIds: await db.stockInPortfolio.findMany({
        select: { stockId: true },
        where: { portfolioId: portfolio.id },
      }),
    }))
  );

  const positive =
    quote && quote.change ? (quote.change > 0 ? true : false) : true;

  return (
    <Card className="flex p-3 gap-3 items-center">
      <Link href={stock.website ?? null} prefetch={false} target="_blank">
        <StockImage src={stock.image} px={45} />
      </Link>
      <div className="f-col">
        <p className="mr-10 w-[200px] truncate text-[19px] font-medium">
          {stock.companyName}
        </p>
        <div className="flex items-center gap-1 mt-1">
          <p className="text-lg">${quote?.price.toFixed(2) ?? "N/A"}</p>
          {positive ? (
            <ChevronsUp className="h-5 w-5 text-green-500" />
          ) : (
            <ChevronsDown className="h-5 w-5 text-red-500" />
          )}
          <p
            className={`text-lg ${
              positive ? "text-green-500" : "text-red-500"
            }`}>
            ({positive && "+"}
            {quote?.changesPercentage.toFixed(2) + "%" ?? "N/A"})
          </p>
        </div>
      </div>
      <div className="absolute right-2.5 top-2.5 flex">
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
