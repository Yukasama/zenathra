import Link from "next/link";
import { Quote } from "@/types/stock";
import React from "react";
import { Stock } from "@prisma/client";
import { Card } from "../ui/card";
import StockImage from "./stock-image";
import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  stock: Pick<Stock, "symbol" | "image"> | undefined;
  quote: Quote | null | undefined;
}

export default function StockItem({ stock, quote, className }: Props) {
  if (!quote) {
    return null;
  }

  const positive = quote.changesPercentage >= 0;

  return (
    <Link href={`/stocks/${quote.symbol}`}>
      <Card
        className={cn(
          "flex items-center justify-between h-12 p-2 bg-item hover:bg-item-hover mb-2",
          className
        )}>
        <div className="flex items-center gap-2">
          <StockImage src={stock?.image} px={35} className="mx-0.5" />
          <div>
            <p className="text-sm">{quote.symbol}</p>
            <p className="text-[12px] truncate w-[180px] text-zinc-500">
              {quote ? quote.name : "N/A"}
            </p>
          </div>
        </div>
        <div>
          <p className="text-end text-[12px]">${quote.price?.toFixed(2)}</p>
          <p
            className={`text-end text-[12px] ${
              positive ? "text-green-500" : "text-red-500"
            }`}>
            {positive && "+"}
            {quote.changesPercentage?.toFixed(2)}%
          </p>
        </div>
      </Card>
    </Link>
  );
}
