import { StockPrice, StockPriceChart } from "@/components";
import { getQuote } from "@/lib/fmp";
import { db } from "@/lib/db";
import { StockImage } from "./shared/stock-image";
import axios from "axios";
import { StockHistoryProps } from "@/lib/validators/stock";
import { StructureProps } from "@/types/layout";
import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  symbol: string | null;
}

function Structure({ className, isLoading, children }: StructureProps) {
  return (
    <div
      className={cn(
        `${isLoading && "animate-pulse-right"} flex flex-1 min-h-[450px]`,
        className
      )}>
      {children}
    </div>
  );
}

export function StockHighlightLoading({ className }: StructureProps) {
  return <Structure isLoading className={className} />;
}

export default async function StockHighlight({ symbol, className }: Props) {
  if (!symbol)
    return (
      <Structure className={className}>
        <p className="text-lg">Highlight could not be loaded.</p>
      </Structure>
    );

  const payload: StockHistoryProps = {
    symbol,
    range: "1D",
  };

  const [quote, image, { data }] = await Promise.all([
    getQuote(symbol),
    db.stock.findFirst({
      select: { image: true },
      where: { symbol: symbol },
    }),
    await axios.post("/api/stock/history", payload),
  ]);

  return (
    <div className="box f-col flex-1 w-full xl:flex-row min-h-[450px]">
      {!quote ? (
        <div className="animate-pulse-right h-full w-full"></div>
      ) : (
        <div className="flex flex-1 items-center justify-between gap-4 p-4 md:gap-7 md:p-7">
          <div className="f-col flex-1 gap-3">
            <div className="flex items-center gap-3">
              <div className="image h-[60px] w-[60px]">
                <StockImage
                  className="image"
                  src={image?.image}
                  px={60}
                  priority
                />
              </div>
              <div className="f-col">
                <p className="text-[25px] font-medium">{symbol}</p>
                <p className="max-w-[220px] truncate text-[15px] font-medium text-slate-600">
                  {quote.name}
                </p>
              </div>
              <StockPrice quote={quote} />
            </div>
            <StockPriceChart
              history={data}
              size="md"
              className="scale-[0.7] -translate-x-[72px] sm:translate-x-0 sm:scale-100"
            />
          </div>
        </div>
      )}
    </div>
  );
}
