import { getDailys, getQuote } from "@/lib/fmp/quote";
import StockCardList from "@/components/stock/stock-card-list";
import IndexList from "@/components/stock/index-list";
import { IndexListLoading } from "@/components/stock/index-list";
import { StockCardListLoading } from "@/components/stock/stock-card-list";
import { Suspense } from "react";
import PageLayout from "@/components/shared/page-layout";
import { db } from "@/db";
import PriceChart from "@/components/price-chart";
import { StockImage } from "@/components/stock/stock-image";

export const revalidate = 30;

export default async function page() {
  const [actives, winners, losers] = await Promise.all([
    getDailys("actives"),
    getDailys("winners"),
    getDailys("losers"),
  ]);

  const [quote, stock] = await Promise.all([
    getQuote(actives?.[0]),
    db.stock.findFirst({
      select: { image: true },
      where: { symbol: actives?.[0] },
    }),
  ]);

  return (
    <PageLayout className="f-col gap-4 md:gap-7">
      <div className="f-col md:flex-row gap-4 md:gap-7">
        {quote && (
          <PriceChart
            symbols={quote.symbol}
            title={quote.symbol}
            description={`Price Chart of ${quote?.name}`}
            image={<StockImage src={stock?.image} px={40} />}
          />
        )}
        <Suspense fallback={<IndexListLoading />}>
          {/* @ts-expect-error Server Component */}
          <IndexList />
        </Suspense>
      </div>

      <Suspense fallback={<StockCardListLoading />}>
        {/* @ts-expect-error Server Component */}
        <StockCardList
          symbols={actives}
          title="Most Active"
          description="Stocks that moved strongly in any direction"
        />
      </Suspense>

      <Suspense fallback={<StockCardListLoading />}>
        {/* @ts-expect-error Server Component */}
        <StockCardList
          symbols={winners}
          title="Daily Winners"
          description="Stocks that have risen most today"
        />
      </Suspense>

      <Suspense fallback={<StockCardListLoading />}>
        {/* @ts-expect-error Server Component */}
        <StockCardList
          symbols={losers}
          title="Daily Underperformers"
          description="Stocks that have fallen most today"
        />
      </Suspense>
    </PageLayout>
  );
}
