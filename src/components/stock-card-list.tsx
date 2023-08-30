import StockCard from "./stock-card";
import { getQuotes } from "@/lib/fmp";
import { StructureProps } from "@/types/layout";
import { db } from "@/lib/db";

interface Props {
  symbols: string[] | null;
}

function Structure({ className, isLoading, children }: StructureProps) {
  return (
    <div
      className={`flex min-h-[100px] justify-evenly gap-4 border-y border-slate-200 py-3 dark:border-zinc-200 ${className}`}>
      {children}
    </div>
  );
}

export const StockCardListLoading = () => {
  return (
    <div className="flex min-h-[100px] justify-evenly gap-4 border-y border-slate-200 py-3 dark:border-zinc-200">
      <StockCard quote={null} image={undefined} />
      <StockCard quote={null} image={undefined} />
      <StockCard quote={null} image={undefined} />
      <StockCard quote={null} image={undefined} />
      <StockCard quote={null} image={undefined} />
    </div>
  );
};

export default async function StockCardList({ symbols }: Props) {
  if (!symbols)
    return (
      <div className="f-col gap-3">
        <p className="text-lg">l</p>
      </div>
    );
  symbols = symbols.slice(0, 5);

  let [quotes, images] = await Promise.all([
    getQuotes(symbols),
    db.stock.findMany({
      select: { symbol: true, image: true },
      where: { symbol: { in: symbols } },
    }),
  ]);

  if (!quotes || quotes.length < 5) return <StockCardListLoading />;

  if (!Array.isArray(images) && images) images = [images];

  return (
    <div className="flex min-h-[100px] justify-evenly gap-4 border-y border-slate-200 py-3 dark:border-zinc-200">
      {quotes.map((quote, i) => (
        <StockCard
          key={i}
          quote={quote}
          image={images && images.find((s) => s.symbol === quote.symbol)?.image}
        />
      ))}
    </div>
  );
}
