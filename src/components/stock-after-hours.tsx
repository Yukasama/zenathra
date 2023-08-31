import { Stock } from "@prisma/client";
import { StructureProps } from "@/types/layout";
import { ChevronsUp, ChevronsDown } from "lucide-react";
import { getQuote } from "@/lib/fmp/quote";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  stock: Stock;
}

function Structure({ className, isLoading, children }: StructureProps) {
  return (
    <div
      className={`${
        isLoading && "animate-pulse-right"
      } flex h-[40px] w-[350px] items-center gap-1 rounded-lg bg-slate-200 p-2 px-4 dark:bg-zinc-400 ${className}`}>
      {children}
    </div>
  );
}

export function StockAfterHoursLoading({ className }: StructureProps) {
  return <Structure className={className} isLoading />;
}

export default async function StockAfterHours({ stock, className }: Props) {
  const quote = await getQuote(stock.symbol);

  const positive: boolean =
    quote && quote.change ? (quote.change > 0 ? true : false) : true;

  return (
    <Structure className={className}>
      <div className="flex h-[40px] w-[350px] items-center gap-1 rounded-lg bg-slate-200 p-2 px-4 dark:bg-zinc-400">
        <p className="mr-0.5 text-[15px] text-zinc-100 dark:text-slate-400">
          After Hours:
        </p>
        <p className="text-[16px]">
          ${quote && quote.price ? quote.price.toFixed(2) : "N/A"}
        </p>
        <p
          className={`text-[15px] ${
            positive ? "text-green-500" : "text-red-500"
          }`}>
          ({positive ? "+" : ""}
          {quote && quote.changesPercentage
            ? quote.changesPercentage.toFixed(2) + "%"
            : "N/A"}
          )
        </p>
        {positive ? (
          <ChevronsUp className="mt-0.5 h-5 w-5 text-green-500" />
        ) : (
          <ChevronsDown className="mt-0.5 h-5 w-5 text-red-500" />
        )}
      </div>
    </Structure>
  );
}
