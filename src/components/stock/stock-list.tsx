import StockListItem from "./stock-list-item";
import React from "react";
import { db } from "@/db";
import { getQuotes } from "@/lib/fmp/quote";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";
import Skeleton from "../ui/skeleton";

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  limit?: number;
}

interface Props extends LoadingProps {
  title?: string;
  description?: string;
  symbols: string[] | null | undefined;
  error?: string;
}

export function StockListLoading({ className, limit = 5 }: LoadingProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <Skeleton>
          <CardTitle className="w-[150px]">a</CardTitle>
        </Skeleton>
        <Skeleton>
          <CardDescription className="w-[200px]">a</CardDescription>
        </Skeleton>
      </CardHeader>
      <div className="f-col gap-2 px-4">
        {[...Array(limit)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-[300px]"></Skeleton>
        ))}
      </div>
    </Card>
  );
}

export default async function StockList({
  symbols,
  title,
  description,
  error,
  limit = 5,
  className,
}: Props) {
  if (!symbols?.length)
    return (
      <p className="text-xl text-center font-medium text-slate-600">{error}</p>
    );

  const symbolsToFetch = symbols.slice(0, Math.min(symbols.length, limit));

  let [stocks, quotes] = await Promise.all([
    db.stock.findMany({
      select: { symbol: true, image: true },
      where: { symbol: { in: symbolsToFetch } },
    }),
    getQuotes(symbolsToFetch),
  ]);

  if (!Array.isArray(stocks)) stocks = [stocks];

  return (
    <>
      {!title && !description ? (
        <div className="space-y-2">
          {quotes?.map((quote) => (
            <StockListItem
              key={quote.symbol}
              stock={stocks.find((s) => s.symbol === quote.symbol)}
              quote={quote}
            />
          ))}
        </div>
      ) : (
        <Card className={cn(className)}>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <div className="space-y-2 px-4">
            {quotes?.map((quote) => (
              <StockListItem
                key={quote.symbol}
                stock={stocks.find((s) => s.symbol === quote.symbol)}
                quote={quote}
              />
            ))}
          </div>
        </Card>
      )}
    </>
  );
}
