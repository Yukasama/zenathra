import { getDailys } from "@/lib/fmp/quote";
import StockCardList from "@/components/stock/stock-card-list";
import IndexList from "@/app/(stock)/stocks/index-list";
import { IndexListLoading } from "@/app/(stock)/stocks/index-list";
import { StockCardListLoading } from "@/components/stock/stock-card-list";
import { Suspense } from "react";
import PageLayout from "@/components/shared/page-layout";
import { db } from "@/db";
import PriceChart from "@/components/stock/price-chart";
import StockImage from "@/components/stock/stock-image";
import { getUser } from "@/lib/auth";

export const metadata = { title: "Stocks on the move" };
export const runtime = "edge";

export default async function page() {
  const [actives, winners, losers, user] = await Promise.all([
    getDailys("actives"),
    getDailys("winners"),
    getDailys("losers"),
    getUser(),
  ]);

  const highlight = actives?.[0];
  const [highlightStock, portfolios] = await Promise.all([
    db.stock.findFirst({
      select: { image: true },
      where: { symbol: actives?.[0].symbol },
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
    <PageLayout className="f-col gap-4 lg:gap-7">
      {/* Stock Highlight + Indexes */}
      <div className="f-col lg:flex-row gap-4 lg:gap-7">
        {highlight?.symbol && (
          <PriceChart
            symbol={highlight.symbol}
            title={highlight.symbol}
            description={`Price Chart of ${highlight?.name}`}
            image={<StockImage src={highlightStock?.image} px={40} />}
          />
        )}
        <Suspense fallback={<IndexListLoading />}>
          <IndexList />
        </Suspense>
      </div>

      {/* Active Stocks */}
      <Suspense fallback={<StockCardListLoading />}>
        <StockCardList
          quotes={actives}
          title="Most Active"
          description="Stocks that moved strongly in any direction"
          portfolios={portfolios}
        />
      </Suspense>

      {/* Stock Winners */}
      <Suspense fallback={<StockCardListLoading />}>
        <StockCardList
          quotes={winners}
          title="Daily Winners"
          description="Stocks that have risen most today"
          portfolios={portfolios}
          onlyInDb={false}
        />
      </Suspense>

      {/* Stock Losers */}
      <Suspense fallback={<StockCardListLoading />}>
        <StockCardList
          quotes={losers}
          title="Daily Underperformers"
          description="Stocks that have fallen most today"
          portfolios={portfolios}
          onlyInDb={false}
        />
      </Suspense>
    </PageLayout>
  );
}
