import { getDailys } from "@/lib/fmp/quote";
import StockHighlight from "@/components/stock-highlight";
import StockCardList from "@/components/stock-card-list";
import IndexList from "@/components/index-list";
import { IndexListLoading } from "@/components/index-list";
import { StockCardListLoading } from "@/components/stock-card-list";
import { StockHighlightLoading } from "@/components/stock-highlight";
import { Suspense } from "react";
import PageLayout from "@/components/shared/page-layout";

export default async function page() {
  const [actives, winners, losers] = await Promise.all([
    getDailys("actives"),
    getDailys("winners"),
    getDailys("losers"),
  ]);

  return (
    <PageLayout className="f-col gap-4 md:gap-7">
      <div className="f-col md:flex-row items-center gap-4 md:gap-7">
        <Suspense fallback={<StockHighlightLoading />}>
          {/* @ts-expect-error Server Component */}
          <StockHighlight symbol={actives?.[0] ?? null} />
        </Suspense>
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
