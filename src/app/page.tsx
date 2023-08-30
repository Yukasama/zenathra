import { getDailys } from "@/lib/fmp";
import StockHighlight from "@/components/stock-highlight";
import StockCardList from "@/components/stock-card-list";
import IndexList from "@/components/index-list";
import { IndexListLoading } from "@/components/index-list";
import { StockCardListLoading } from "@/components/stock-card-list";
import { StockHighlightLoading } from "@/components/stock-highlight";
import { Suspense } from "react";

export default async function page() {
  const [actives, winners, losers] = await Promise.all([
    getDailys("actives"),
    getDailys("winners"),
    getDailys("losers"),
  ]);

  return (
    <div className="f-col p-4 gap-4 md:gap-7 md:p-7">
      <div className="f-col md:flex-row items-center gap-4 md:gap-7">
        <Suspense fallback={<StockHighlightLoading />}>
          <StockHighlight symbol={actives?.[0] ?? null} />
        </Suspense>
        <Suspense fallback={<IndexListLoading />}>
          <IndexList />
        </Suspense>
      </div>

      <Suspense fallback={<StockCardListLoading />}>
        <StockCardList
          symbols={actives}
          title="Most Active"
          description="Stocks that moved strongly in any direction"
        />
      </Suspense>

      <Suspense fallback={<StockCardListLoading />}>
        <StockCardList
          symbols={winners}
          title="Daily Winners"
          description="Stocks that risen most today"
        />
      </Suspense>

      <Suspense fallback={<StockCardListLoading />}>
        <StockCardList
          symbols={losers}
          title="Daily Underperformers"
          description="Stocks that fallen most today"
        />
      </Suspense>
    </div>
  );
}
