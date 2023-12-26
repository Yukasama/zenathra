import { ArrowBigUp, ArrowBigDown } from "lucide-react";
import { getAfterHoursQuote } from "@/lib/fmp/quote";
import { StockQuote } from "@/types/stock";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  stockQuote: Pick<StockQuote, "symbol" | "price">;
}

export default async function StockAfterHours({ stockQuote }: Props) {
  // const afterHoursQuote = await getAfterHoursQuote(stockQuote.symbol);

  const afterHoursQuote = {
    price: 194.4,
  };

  if (!afterHoursQuote || !stockQuote.price) {
    return <p className="text-zinc-400">After Hours: Failed to load</p>;
  }

  const changesPercentage =
    (afterHoursQuote?.price / stockQuote.price - 1) * 100 ?? 0;
  const positive = changesPercentage >= 0;

  return (
    <div className="flex gap-2 items-center">
      <p className="text-zinc-400">After Hours:</p>
      <div className="flex items-center gap-1">
        <p>{afterHoursQuote?.price?.toFixed(2)}</p>
        <span className="text-[12px] text-zinc-400 mt-[1px]">USD</span>
        {positive ? (
          <ArrowBigUp size={18} className="text-price-up" />
        ) : (
          <ArrowBigDown size={18} className="text-price-down" />
        )}
        <p className={`${positive ? "text-price-up" : "text-price-down"}`}>
          {changesPercentage?.toFixed(2) + "%"}
        </p>
      </div>
    </div>
  );
}
