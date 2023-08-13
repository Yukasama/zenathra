import { Quote } from "@/types/stock";
import { TrendingDown, TrendingUp } from "react-feather";

interface Props {
  quote: Quote | null;
}

export default function StockPrice({ quote }: Props) {
  const positive: boolean =
    quote && quote.change ? (quote.change > 0 ? true : false) : true;

  return (
    <div className="mx-1 f-col items-center justify-between gap-4 lg:flex-row">
      <div className="flex items-center">
        <span className="mt-1">$</span>
        <p className="text-[22px] xl:text-[26px] font-light">
          {quote && quote.price ? quote.price.toFixed(2) : "N/A"}
        </p>
      </div>

      <div
        className={`flex items-center gap-1.5 rounded-lg px-1.5 py-0.5 xl:px-2 xl:py-1 ${
          positive
            ? "bg-green-200/60 dark:bg-green-500/30"
            : "bg-red-200/80 dark:bg-red-500/30"
        }`}>
        {positive ? (
          <TrendingUp className="mt-[1px] h-4 w-4 rounded-md text-green-500" />
        ) : (
          <TrendingDown className="mt-[1px] h-4 w-4 rounded-md text-red-500" />
        )}
        <div
          className={`${
            positive ? "text-green-500" : "text-red-500"
          } rounded-md text-[14px]`}>
          <span>
            ({positive && "+"}
            {quote && quote.changesPercentage
              ? quote.changesPercentage.toFixed(2) + "%"
              : "N/A"}
            )
          </span>
        </div>
      </div>
    </div>
  );
}
