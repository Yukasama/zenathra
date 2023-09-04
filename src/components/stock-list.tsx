import StockListItem from "./stock-list-item";
import React from "react";
import { db } from "@/lib/db";
import { getQuotes } from "@/lib/fmp/quote";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  limit?: number;
  symbols: string[] | null | undefined;
  error?: string;
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

  let stocks = await db.stock.findMany({
    select: { symbol: true, image: true },
    where: { symbol: { in: symbolsToFetch } },
  });

  const quotes = await getQuotes(symbolsToFetch);

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
          <CardContent className="space-y-2">
            {quotes?.map((quote) => (
              <StockListItem
                key={quote.symbol}
                stock={stocks.find((s) => s.symbol === quote.symbol)}
                quote={quote}
              />
            ))}
          </CardContent>
        </Card>
      )}
    </>
  );
}
