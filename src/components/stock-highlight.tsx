import { getQuote } from "@/lib/fmp/quote";
import { db } from "@/lib/db";
import { StructureProps } from "@/types/layout";
import { cn } from "@/lib/utils";
import StockPriceChart from "./stock-price-chart";

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

  const [quote, image] = await Promise.all([
    getQuote(symbol),
    db.stock.findFirst({
      select: { image: true },
      where: { symbol: symbol },
    }),
  ]);

  return (
    <StockPriceChart
      symbol={symbol}
      title={symbol}
      description={`Price Chart of ${quote?.name}`}
      image={image?.image}
      showImage
      height={230}
      width={500}
    />
  );
}
