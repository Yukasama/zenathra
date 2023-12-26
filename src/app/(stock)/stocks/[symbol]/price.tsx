import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { Stock } from "@prisma/client";
import { getAfterHoursQuote, getQuote } from "@/lib/fmp/quote";
import StockAfterHours from "./stock-after-hours";

interface Props {
  stock: Pick<Stock, "symbol">;
}

export default async function Price({ stock }: Props) {
  const [quote, afterQuote] = await Promise.all([
    getQuote(stock.symbol),
    getAfterHoursQuote(stock.symbol),
  ]);

  if (!quote) {
    return <p className="text-zinc-400">Price failed to load.</p>;
  }

  const positive = quote?.changesPercentage >= 0;

  return (
    <div className="f-col gap-0.5">
      <div className="flex items-center gap-1">
        <p className="text-3xl">{quote?.price?.toFixed(2)}</p>
        <span className="text-sm text-zinc-400 mt-[9px]">USD</span>
        <div className="mt-0.5 flex items-center gap-0.5">
          {positive ? (
            <ArrowBigUp size={22} className="text-price-up" />
          ) : (
            <ArrowBigDown size={22} className="text-price-down" />
          )}
          <p
            className={`text-xl ${
              positive ? "text-price-up" : "text-price-down"
            }`}>
            {quote.changesPercentage?.toFixed(2).replace("-", "")}%
          </p>
        </div>
      </div>
      <StockAfterHours stockQuote={quote} />
    </div>
  );
}
