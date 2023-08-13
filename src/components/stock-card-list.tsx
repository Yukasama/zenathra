import { getQuotes } from "@/lib/quote-get";
import { getImages } from "@/lib/stock-get";
import { Quote, StockImage } from "@/types/stock";
import { StockCard } from "@/components";

interface Props {
  symbols: string[];
}

export const StockCardListLoading = () => {
  return (
    <div className="flex min-h-[100px] justify-evenly gap-4 border-y border-slate-200 py-3 dark:border-moon-200">
      <StockCard quote={null} image={null} />
      <StockCard quote={null} image={null} />
      <StockCard quote={null} image={null} />
      <StockCard quote={null} image={null} />
      <StockCard quote={null} image={null} />
    </div>
  );
};

export default async function StockCardList({ symbols }: Props) {
  symbols = symbols.slice(0, 5);

  let [quotes, images]: [Quote[] | null, StockImage[] | null] =
    await Promise.all([getQuotes(symbols), getImages(symbols)]);

  if (!quotes || quotes.length < 5) return <StockCardListLoading />;

  if (!Array.isArray(images) && images) images = [images];

  return (
    <div className="flex min-h-[100px] justify-evenly gap-4 border-y border-slate-200 py-3 dark:border-moon-200">
      <>
        {quotes.map((quote, i) => (
          <StockCard
            key={i}
            quote={quote}
            image={images && images.find((s) => s.symbol === quote.symbol)}
          />
        ))}
      </>
    </div>
  );
}
