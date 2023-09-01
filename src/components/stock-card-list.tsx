import StockCard from "./stock-card";
import { getQuotes } from "@/lib/fmp/quote";
import { StructureProps } from "@/types/layout";
import { db } from "@/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface Props {
  symbols: string[] | null;
  title: string;
  description?: string;
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
    <div className="flex">
      <StockCard quote={null} image={undefined} />
      <StockCard quote={null} image={undefined} />
      <StockCard quote={null} image={undefined} />
      <StockCard quote={null} image={undefined} />
      <StockCard quote={null} image={undefined} />
    </div>
  );
};

export default async function StockCardList({
  symbols,
  title,
  description,
}: Props) {
  if (!symbols)
    return (
      <div className="f-col gap-3">
        <p className="text-lg">l</p>
      </div>
    );
  symbols = symbols.slice(0, 5);

  let [quotes, stocks] = await Promise.all([
    getQuotes(symbols),
    db.stock.findMany({
      select: { symbol: true, image: true },
      where: { symbol: { in: symbols } },
    }),
  ]);

  if (!quotes) return <StockCardListLoading />;

  if (!Array.isArray(stocks) && stocks) stocks = [stocks];

  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-between gap-4">
        {quotes.map((quote) => (
          <StockCard
            key={quote.symbol}
            quote={quote}
            image={stocks.find((s) => s.symbol === quote.symbol)?.image}
          />
        ))}
      </CardContent>
    </Card>
  );
}
