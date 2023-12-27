"use client";

import StockImage from "@/components/stock/stock-image";
import { Card } from "@/components/ui/card";
import { Stock } from "@prisma/client";
import Link from "next/link";

interface Props {
  results: Pick<Stock, "symbol" | "companyName" | "image">[] | undefined;
  isFetched: boolean;
}

export default function ScreenerResults({ results, isFetched }: Props) {
  return (
    <>
      {!isFetched || !results ? (
        <div className="f-col gap-2 pt-2">
          {[...Array(10)].map((_, i) => (
            <Card key={i} className="animate-pulse-right h-[60px]" />
          ))}
        </div>
      ) : isFetched && !results?.length ? (
        <div className="mt-16">
          <h3 className="font-medium text-center text-lg">
            No Stocks matching the query
          </h3>
          <p className="text-sm text-center text-zinc-400">
            Please select a combination of other filters
          </p>
        </div>
      ) : (
        <div className="f-col hidden-scrollbar max-h-[800px] gap-2 overflow-scroll">
          {results?.map((stock) => (
            <Link
              key={stock.symbol}
              href={`/stocks/${stock.symbol}`}
              prefetch={false}>
              <Card className="flex h-[60px] px-4 hover:bg-zinc-100 dark:hover:bg-zinc-900">
                <div className="col-span-3 flex items-center gap-4">
                  <StockImage src={stock.image} px={30} />
                  <div className="f-col">
                    <p className="font-medium">{stock.symbol}</p>
                    <p className="text-sm text-zinc-500">{stock.companyName}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
