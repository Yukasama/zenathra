import { getImages, getQuotes } from "@/lib/stocks/client/getStocks";
import { Quote, StockImage } from "@/types/stock";
import { Suspense } from "react";
import { Card } from "@/components/ui/stocks";

interface Props {
  symbols: string[];
}

const CardLoading = () => {
  return (
    <>
      <Card quote={null} image={null} />
    </>
  );
};

export const CardsLoading = () => {
  return (
    <div className="flex min-h-[100px] justify-evenly gap-4 border-y border-gray-200 py-3 dark:border-moon-200">
      <Card quote={null} image={null} />
      <Card quote={null} image={null} />
      <Card quote={null} image={null} />
      <Card quote={null} image={null} />
      <Card quote={null} image={null} />
    </div>
  );
};

export default async function CardList({ symbols }: Props) {
  symbols = symbols.slice(0, 5);

  let [quotes, images]: [Quote[] | null, StockImage[] | null] =
    await Promise.all([getQuotes(symbols), getImages(symbols)]);

  if (!quotes || quotes.length < 5) return <CardsLoading />;

  if (!Array.isArray(images) && images) images = [images];

  return (
    <div className="flex min-h-[100px] justify-evenly gap-4 border-y border-gray-200 py-3 dark:border-moon-200">
      <>
        {quotes.map((quote, i) => (
          <Card
            key={i}
            quote={quote}
            image={images && images.find((s) => s.symbol === quote.symbol)}
          />
        ))}
      </>
    </div>
  );
}
