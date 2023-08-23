import Link from "next/link";
import { StockPortfolioAddButton } from "@/components";
import { Stock } from "@prisma/client";
import { StructureProps } from "@/types/layout";
import React from "react";
import { Session } from "next-auth";
import { ChevronsDown, ChevronsUp } from "lucide-react";
import { getQuote } from "@/lib/fmp";
import { StockImage } from "./shared/stock-image";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  session: Session | null;
  stock: Stock;
}

function Structure({ className, isLoading, children }: StructureProps) {
  return (
    <div
      className={`${
        isLoading && "animate-pulse-right"
      } flex h-[90px] w-[350px] animate-appear-up items-center gap-3 rounded-lg bg-slate-200 p-2 px-4 dark:bg-moon-400 ${className}`}>
      {children}
    </div>
  );
}

export function StockPrice2Loading({ className }: StructureProps) {
  return <Structure className={className} isLoading />;
}

export default async function StockPrice2({ session, stock }: Props) {
  const [quote, portfolios] = await Promise.all([getQuote(stock.symbol), null]);

  const positive =
    quote && quote.change ? (quote.change > 0 ? true : false) : true;

  return (
    <Structure>
      <div className="image h-[50px] w-[50px]">
        <Link prefetch={false} href={stock.website || ""} target="_blank">
          <StockImage src={stock.image} px={50} />
        </Link>
      </div>
      <div className="f-col">
        <p className="mr-10 w-[200px] truncate text-[22px] font-medium">
          {stock.companyName}
        </p>
        <div className="flex items-end gap-1">
          <p className="text-[20px]">
            ${quote && quote.price ? quote.price.toFixed(2) : "N/A"}
          </p>
          <p
            className={`text-[17px] ${
              positive ? "text-green-500" : "text-red-500"
            }`}>
            {positive ? "+" : ""}
            {quote && quote.change ? quote.change.toFixed(2) : "N/A"}
          </p>
          <p
            className={`text-[17px] ${
              positive ? "text-green-500" : "text-red-500"
            }`}>
            (
            {quote && quote.changesPercentage
              ? quote.changesPercentage.toFixed(2) + "%"
              : "N/A"}
            )
          </p>
          {positive ? (
            <ChevronsUp className="mt-1 h-6 w-6 text-green-500" />
          ) : (
            <ChevronsDown className="mt-2 h-6 w-6 text-red-500" />
          )}
        </div>
      </div>
      <div className="absolute right-2.5 top-2.5 flex">
        <StockPortfolioAddButton
          session={session}
          symbol={stock.symbol}
          portfolios={portfolios}
        />
      </div>
    </Structure>
  );
}
