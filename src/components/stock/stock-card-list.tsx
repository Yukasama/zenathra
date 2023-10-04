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
import GridLayout from "../shared/grid-layout";

interface Props {
  symbols: string[] | null;
  title: string;
  description?: string;
}

export function StockCardListLoading() {
  return (
    <GridLayout>
      {[...Array(8)].map((_, i) => (
        <StockCardLoading key={i} />
      ))}
    </GridLayout>
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
        <GridLayout>
          {quotes.map((quote) => (
            <StockCard
              key={quote.symbol}
              quote={quote}
              image={stocks.find((s) => s.symbol === quote.symbol)?.image}
            />
          ))}
        </GridLayout>
      </CardContent>
    </Card>
  );
}
