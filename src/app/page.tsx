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
    <div className="m-1 mb-7 f-col gap-6">
      <div className="f-col md:flex-row items-center justify-between gap-4 p-4 md:gap-7 md:p-7">
        <Suspense fallback={<StockHighlightLoading />}>
          {/* <StockHighlight symbol={actives?.[0] ?? null} /> */}
        </Suspense>
        <Suspense fallback={<IndexListLoading />}>
          <IndexList />
        </Suspense>
        <Suspense fallback={<IndexListLoading />}>
          <IndexList />
        </Suspense>
      </div>

      <div className="mx-3 f-col">
        <p className="ml-1 mt-3 text-[23px] font-medium">Most Active</p>
        <Suspense fallback={<StockCardListLoading />}>
          {<StockCardList symbols={actives} />}
        </Suspense>
      </div>
      <div className="mx-3 f-col">
        <p className="ml-1 mt-3 text-[23px] font-medium">Daily Winners</p>
        <Suspense fallback={<StockCardListLoading />}>
          {<StockCardList symbols={winners} />}
        </Suspense>
      </div>
      <div className="mx-3 f-col">
        <p className="ml-1 mt-3 text-[23px] font-medium">
          Daily Underperformers
        </p>
        <Suspense fallback={<StockCardListLoading />}>
          {<StockCardList symbols={losers} />}
        </Suspense>
      </div>
    </div>
  );
}
