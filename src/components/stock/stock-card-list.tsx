import StockCard, { StockCardLoading } from "./stock-card";
import { getQuotes } from "@/lib/fmp/quote";
import { db } from "@/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Skeleton from "../ui/skeleton";

interface Props {
  symbols: string[] | null;
  title: string;
  description?: string;
}

export function StockCardListLoading() {
  return (
    <div>
      <div className="p-6 py-7 f-col gap-1.5 items-start">
        <Skeleton>
          <div className="h-4 w-[200px]"></div>
        </Skeleton>
        <Skeleton>
          <div className="h-4 w-[300px]"></div>
        </Skeleton>
      </div>
      <CardContent>
        <div className="f-col gap-6 md:grid md:grid-cols-3 xl:gap-8 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <StockCardLoading key={i} />
          ))}
        </div>
      </CardContent>
    </div>
  );
}

export default async function StockCardList({
  symbols,
  title,
  description,
}: Props) {
  if (!symbols)
    return (
      <Card className="border-none">
        <CardContent className="f-box text-slate-400">
          Stocks could not be loaded.
        </CardContent>
      </Card>
    );

  symbols = symbols.slice(0, 10);

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
      <CardContent>
        <div className="f-col gap-6 md:grid md:grid-cols-3 xl:gap-8 xl:grid-cols-4">
          {quotes.map((quote) => (
            <StockCard
              key={quote.symbol}
              quote={quote}
              image={stocks.find((s) => s.symbol === quote.symbol)?.image}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
