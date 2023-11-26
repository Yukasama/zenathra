import StockCard, { StockCardLoading } from "./stock-card";
import { db } from "@/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { SkeletonText } from "../ui/skeleton";
import { PortfolioWithStocks } from "@/types/db";
import { Quote } from "@/types/stock";

interface Props {
  quotes: Quote[] | undefined;
  portfolios?:
    | Pick<
        PortfolioWithStocks,
        "id" | "title" | "color" | "stocks" | "isPublic"
      >[]
    | undefined;
  title?: string;
  description?: string;
  onlyInDb?: boolean;
}

export function StockCardListLoading() {
  return (
    <div>
      <div className="p-6 py-7 f-col gap-1.5 items-start">
        <SkeletonText />
      </div>
      <CardContent className="f-col gap-6 lg:grid lg:grid-cols-2 xl:gap-8 xl:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <StockCardLoading key={i} />
        ))}
      </CardContent>
    </div>
  );
}

export default async function StockCardList({
  quotes,
  portfolios,
  title,
  description,
  onlyInDb = true,
}: Props) {
  if (!quotes) {
    return (
      <Card className="border-none min-h-[210px] lg:min-h-[250px]">
        <CardContent className="f-box text-zinc-400">
          Stocks could not be loaded.
        </CardContent>
      </Card>
    );
  }

  if (onlyInDb) {
    quotes = quotes.slice(0, 100);
  } else {
    quotes = quotes.slice(0, 6);
  }

  let stocks = await db.stock.findMany({
    select: { id: true, symbol: true, image: true },
    where: { symbol: { in: quotes.map((quote) => quote.symbol) } },
  });

  return (
    <Card className="border-none bg-transparent">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="f-col gap-6 lg:grid lg:grid-cols-2 xl:gap-8 xl:grid-cols-3">
          {onlyInDb ? (
            <>
              {stocks.map((stock) => (
                <StockCard
                  key={stock.symbol}
                  quote={quotes?.find((quote) => quote.symbol === stock.symbol)}
                  stock={stock}
                  portfolios={portfolios}
                />
              ))}
            </>
          ) : (
            <>
              {quotes.map((quote) => (
                <StockCard
                  key={quote.symbol}
                  quote={quote}
                  stock={stocks?.find((s) => s.symbol === quote.symbol)}
                  portfolios={portfolios}
                />
              ))}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
