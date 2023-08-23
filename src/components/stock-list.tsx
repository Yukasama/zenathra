import { StockListItem, StockListItemLoading } from "@/components";
import { StructureProps } from "@/types/layout";
import React from "react";
import { db } from "@/lib/db";
import { getQuotes } from "@/lib/fmp";

interface ListStructureProps extends StructureProps {
  title?: string;
}

interface SharedProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  limit?: number;
}

interface Props extends SharedProps {
  stockIds: string[];
  error?: string;
}

function Structure({
  title,
  children,
  isLoading,
  className,
}: ListStructureProps) {
  return (
    <div
      className={`f-col min-w-[300px] gap-[3px] ${title && "p-5 py-4"} ${
        isLoading && "animate-pulse-right"
      } ${className}`}>
      <p className="text-[19px] font-medium mb-1.5">{title}</p>
      {children}
    </div>
  );
}

export function StockListLoading({ title, limit = 5, className }: SharedProps) {
  return (
    <Structure title={title} className={className}>
      {[...Array(limit)].map((_, i) => (
        <StockListItemLoading key={i} />
      ))}
    </Structure>
  );
}

export default async function StockList({
  stockIds,
  title = "",
  error,
  limit = 5,
  className,
}: Props) {
  if (!stockIds?.length)
    return (
      <p className="text-xl text-center font-medium text-slate-600">{error}</p>
    );

  const idsToFetch = stockIds.slice(0, Math.min(stockIds.length, limit));

  let stocks = await db.stock.findMany({
    select: { id: true, symbol: true, image: true },
    where: { id: { in: idsToFetch } },
  });

  const quotes = await getQuotes(stocks.map((s) => s.symbol));

  if (!Array.isArray(stocks)) stocks = [stocks];

  return (
    <Structure title={title} className={className}>
      {stockIds.map((stockId) => {
        const stockItem = stocks?.find((s) => stockId === s.id);

        return (
          <StockListItem
            key={stockId}
            stock={
              stockItem
                ? {
                    symbol: stockItem.symbol,
                    image: stockItem.image,
                  }
                : null
            }
            quote={
              quotes?.find(
                (q) => stocks.find((s) => stockId === s.id)?.symbol === q.symbol
              ) ?? null
            }
          />
        );
      })}
    </Structure>
  );
}
