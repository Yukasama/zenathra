import { getQuote } from "@/lib/quote-get";
import { getImage } from "@/lib/stock-get";
import { Quote, StockImage } from "@/types/stock";
import Image from "next/image";
import {
  StockHighlightChartLoader,
  StockChartLoading,
  StockPrice,
} from "@/components";
import { Suspense } from "react";

interface Props {
  symbol: string | null;
}

export const StockHighlightLoading = () => {
  return <div className="animate-pulse-right flex flex-1 min-h-[300px]"></div>;
};

export default async function StockHighlight({ symbol }: Props) {
  if (!symbol)
    return <div className="animate-pulse-right flex min-h-[450px]"></div>;

  const [quote, image]: [Quote | null, StockImage | null] = await Promise.all([
    getQuote(symbol),
    getImage(symbol),
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
                <Image
                  className="image"
                  src={image ? image.image : "/images/logo/logo.png"}
                  height={60}
                  width={60}
                  alt={quote.name}
                  priority
                />
              </div>
              <div className="f-col">
                <p className="text-[25px] font-medium">{quote.symbol}</p>
                <p className="max-w-[220px] truncate text-[15px] font-medium text-slate-600">
                  {quote.name}
                </p>
              </div>
              <StockPrice quote={quote} />
            </div>
            <Suspense
              fallback={
                <StockChartLoading
                  size="md"
                  className="scale-[0.7] -translate-x-[72px] sm:translate-x-0 sm:scale-100"
                />
              }>
              {/*// @ts-ignore*/}
              <StockHighlightChartLoader
                symbol={symbol}
                className="scale-[0.7] -translate-x-[72px] sm:translate-x-0 sm:scale-100"
              />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
}
