import Link from "next/link";
import { Quote } from "@/types/stock";
import React from "react";
import { Stock } from "@prisma/client";
import { Card } from "../ui/card";
import { StockImage } from "./stock-image";
import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  stock: Pick<Stock, "symbol" | "image"> | undefined;
  quote: Quote | undefined;
}

export default function StockListItem({ stock, quote, className }: Props) {
  if (!quote) return null;

  return (
    <Link href={`/stocks/${quote.symbol}`}>
      <Card
        className={cn(
          "flex items-center justify-between h-12 p-2 hover:bg-slate-100 dark:hover:bg-slate-900 mb-2 mx-2",
          className
        )}>
        <div className="flex items-center gap-2">
          <StockImage src={stock?.image} px={35} className="mx-0.5" />
          <div>
            <p className="text-sm">{quote.symbol}</p>
            <p className="text-[12px] truncate w-[180px] text-slate-500">
              {quote ? quote.name : "N/A"}
            </p>
          </div>
        </div>
        <div>
          <p className="text-end text-[12px]">
            ${quote && quote.price ? quote.price.toFixed(2) : "N/A"}
          </p>
          <p
            className={`text-end text-[12px] ${
              quote.change > 0 ? "text-green-500" : "text-red-500"
            }`}>
            {quote.change > 0 && "+"}
            {quote && quote.changesPercentage
              ? quote.changesPercentage.toFixed(2)
              : "N/A"}
            %
          </p>
        </div>
      </Card>
    </Link>
  );
}
