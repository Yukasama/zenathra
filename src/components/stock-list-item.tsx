import Link from "next/link";
import Image from "next/image";
import { Quote } from "@/types/stock";
import { StructureProps } from "@/types/layout";
import React from "react";
import { Stock } from "@prisma/client";

interface SharedProps extends React.HTMLAttributes<HTMLDivElement> {}

interface Props extends SharedProps {
  stock: Pick<Stock, "symbol" | "image"> | null;
  quote: Quote | null;
}

function Structure({ children, className, isLoading }: StructureProps) {
  return (
    <div
      className={`mb-1 flex h-[50px] items-center justify-between gap-3 rounded-md p-3 pl-2 ${
        isLoading
          ? "animate-pulse-right"
          : "bg-slate-100 hover:bg-slate-300 dark:bg-moon-300 dark:hover:bg-moon-200"
      } ${className}`}>
      {children}
    </div>
  );
}

export function StockListItemLoading({ className }: SharedProps) {
  return <Structure isLoading className={className} />;
}

export default function StockListItem({ stock, quote, className }: Props) {
  const pos = quote ? (quote.change > 0 ? true : false) : true;

  return (
    <>
      {!quote ? (
        <Structure>
          <p>Stock could not be loaded.</p>
        </Structure>
      ) : (
        <Link href={`/stocks/${quote.symbol}`}>
          <Structure className={className}>
            <div className="f-box gap-3">
              <div className="image h-[40px] w-[40px]">
                <Image
                  src={stock?.image ?? "/images/stock.jpg"}
                  height={40}
                  width={40}
                  alt="Company Logo"
                  loading="lazy"
                />
              </div>
              <div>
                <p className="text-sm">{quote.symbol}</p>
                <p className="text-[12px] text-slate-500">
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
                  pos ? "text-green-500" : "text-red-500"
                }`}>
                {pos && "+"}
                {quote && quote.changesPercentage
                  ? quote.changesPercentage.toFixed(2)
                  : "N/A"}
                %
              </p>
            </div>
          </Structure>
        </Link>
      )}
    </>
  );
}
