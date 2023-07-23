import { getImages, getQuotes } from "@/lib/stocks/client/getStocks";
import { Quote, StockImage } from "@/types/stock";
import ListItem from "@/components/ui/stocks/ListItem";

interface Props {
  symbols: string[];
  title?: string;
  error?: string;
  limit?: number;
}

interface LoadingProps {
  title?: string;
  limit?: number;
}

export const ListLoading = ({ title, limit = 5 }: LoadingProps) => {
  return (
    <div
      className={`flex min-w-[300px] animate-appear-up flex-col gap-2 borderless-box ${
        title && "p-5 py-4"
      }`}>
      <p className="text-[19px] font-medium">{title}</p>
      <div>
        {[...Array(limit)].map((_, i) => (
          <div
            key={i}
            className={`animate-pulse-right mb-1 flex h-[50px] w-full items-center justify-between gap-3 rounded-md p-3 pl-2`}></div>
        ))}
      </div>
    </div>
  );
};

export default async function List({
  symbols,
  title = "",
  error,
  limit = 5,
}: Props) {
  if (!symbols) return <ListLoading />;

  try {
    symbols = symbols.slice(0, symbols.length > limit ? limit : symbols.length);
  } catch {
    return (
      <p className="text-xl text-center font-medium text-gray-600">{error}</p>
    );
  }

  if (!symbols.length)
    return (
      <p className="text-xl text-center font-medium text-gray-600">{error}</p>
    );

  let [peerImages, quotes]: [StockImage[] | null, Quote[] | null] =
    await Promise.all([getImages(symbols), getQuotes(symbols)]);

  if (!Array.isArray(peerImages) && peerImages) peerImages = [peerImages];

  return (
    <div
      className={`flex min-w-[300px] animate-appear-up flex-col gap-2 borderless-box ${
        title && "p-5 py-4"
      }`}>
      <p className="text-[19px] font-medium">{title}</p>
      <div className="f-col">
        {symbols.map((symbol) => (
          <ListItem
            key={symbol}
            symbol={symbol}
            image={peerImages && peerImages.find((p) => p.symbol === symbol)}
            quote={quotes?.find((q) => symbol === q.symbol) ?? null}
          />
        ))}
      </div>
    </div>
  );
}
