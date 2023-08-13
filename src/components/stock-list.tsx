import { getImages } from "@/lib/stock-get";
import { getQuotes } from "@/lib/quote-get";
import { Quote, StockImage } from "@/types/stock";
import { StockListItem, StockListItemLoading } from "@/components";
import { StructureProps } from "@/types/layout";

interface ListStructureProps extends StructureProps {
  title?: string;
}

interface SharedProps {
  title?: string;
  limit?: number;
  className?: string;
}

interface Props extends SharedProps {
  symbols: string[];
  error?: string;
}

function Structure({
  title,
  children,
  isLoading,
  className,
}: ListStructureProps) {
  return (
    <div
      className={`f-col min-w-[300px] gap-[3px] ${title && "p-5 py-4"} ${
        isLoading && "animate-pulse-right"
      } ${className}`}>
      <p className="text-[19px] font-medium mb-1.5">{title}</p>
      {children}
    </div>
  );
}

export function StockListLoading({ title, limit = 5, className }: SharedProps) {
  return (
    <Structure title={title} className={className}>
      {[...Array(limit)].map((_, i) => (
        <StockListItemLoading key={i} />
      ))}
    </Structure>
  );
}

export default async function StockList({
  symbols,
  title = "",
  error,
  limit = 5,
  className,
}: Props) {
  if (!symbols?.length)
    return (
      <p className="text-xl text-center font-medium text-slate-600">{error}</p>
    );

  const symbolsToFetch = symbols.slice(0, Math.min(symbols.length, limit));

  let [peerImages, quotes]: [StockImage[] | null, Quote[] | null] =
    await Promise.all([getImages(symbolsToFetch), getQuotes(symbolsToFetch)]);

  if (!Array.isArray(peerImages) && peerImages) peerImages = [peerImages];

  return (
    <Structure title={title} className={className}>
      {symbols.map((symbol) => (
        <StockListItem
          key={symbol}
          symbol={symbol}
          image={peerImages && peerImages.find((p) => p.symbol === symbol)}
          quote={quotes?.find((q) => symbol === q.symbol) ?? null}
        />
      ))}
    </Structure>
  );
}
