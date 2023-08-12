import { ChevronsUp, ChevronsDown } from "react-feather";
import { Stock } from "@prisma/client";
import { getQuote } from "@/lib/stocks/client/getStocks";
import { StructureProps } from "@/types/layout";

interface SharedProps {
  className?: string;
}

interface Props {
  stock: Stock;
}

function Structure({ className, isLoading, children }: StructureProps) {
  return (
    <div
      className={`${
        isLoading && "animate-pulse-right"
      } flex h-[40px] w-[350px] items-center gap-1 rounded-lg bg-gray-200 p-2 px-4 dark:bg-moon-400 ${className}`}>
      {children}
    </div>
  );
}

export function AfterHoursLoading({ className }: SharedProps) {
  return <Structure className={className} isLoading />;
}

export default async function AfterHours({ stock }: Props) {
  const quote = await getQuote(stock.symbol);

  const positive: boolean =
    quote && quote.change ? (quote.change > 0 ? true : false) : true;

  return (
    <Structure>
      <div className="flex h-[40px] w-[350px] items-center gap-1 rounded-lg bg-gray-200 p-2 px-4 dark:bg-moon-400">
        <p className="mr-0.5 text-[15px] text-moon-100 dark:text-gray-400">
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
