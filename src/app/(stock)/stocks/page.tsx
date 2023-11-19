import { getDailys, getQuote } from "@/lib/fmp/quote";
import StockCardList from "@/components/stock/stock-card-list";
import IndexList from "@/app/(stock)/stocks/index-list";
import { IndexListLoading } from "@/app/(stock)/stocks/index-list";
import { StockCardListLoading } from "@/components/stock/stock-card-list";
import { Suspense } from "react";
import PageLayout from "@/components/shared/page-layout";
import { db } from "@/db";
import PriceChart from "@/components/stock/price-chart";
import { StockImage } from "@/components/stock/stock-image";
import { SITE } from "@/config/site";
import { getUser } from "@/lib/auth";

export const metadata = {
  title: `${SITE.name} | Stocks on the Move`,
};

export const revalidate = 30;

export const runtime = "edge";

export default async function page() {
  const [actives, winners, losers] = await Promise.all([
    getDailys("actives"),
    getDailys("winners"),
    getDailys("losers"),
  ]);

  const user = await getUser();

  const [quote, stock, portfolios] = await Promise.all([
    getQuote(actives?.[0]),
    db.stock.findFirst({
      select: { image: true },
      where: { symbol: actives?.[0] },
    }),
    db.portfolio.findMany({
      select: {
        id: true,
        title: true,
        isPublic: true,
        color: true,
        stocks: {
          select: { stockId: true },
        },
      },
      where: { creatorId: user?.id },
    }),
  ]);

  return (
    <PageLayout className="f-col gap-4 md:gap-7">
      <div className="f-col md:flex-row gap-4 md:gap-7">
        {quote && (
          <PriceChart
            symbol={quote.symbol}
            title={quote.symbol}
            description={`Price Chart of ${quote?.name}`}
            image={<StockImage src={stock?.image} px={40} />}
          />
        )}
        <Suspense fallback={<IndexListLoading />}>
          <IndexList />
        </Suspense>
      </div>

      <Suspense fallback={<StockCardListLoading />}>
        <StockCardList
          symbols={actives}
          title="Most Active"
          description="Stocks that moved strongly in any direction"
          isAuthenticated={!!user}
          portfolios={portfolios}
        />
      </Suspense>

      <Suspense fallback={<StockCardListLoading />}>
        <StockCardList
          symbols={winners}
          title="Daily Winners"
          description="Stocks that have risen most today"
          isAuthenticated={!!user}
          portfolios={portfolios}
        />
      </Suspense>

      <Suspense fallback={<StockCardListLoading />}>
        <StockCardList
          symbols={losers}
          title="Daily Underperformers"
          description="Stocks that have fallen most today"
          isAuthenticated={!!user}
          portfolios={portfolios}
        />
      </Suspense>
    </PageLayout>
  );
}
