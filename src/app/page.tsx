import { getDailys } from "@/lib/fmp";
import {
  StockCardList,
  StockHighlight,
  IndexList,
  IndexListLoading,
  StockCardListLoading,
  StockHighlightLoading,
} from "@/components";
import { Suspense } from "react";

export default async function page() {
  const [actives, winners, losers]: [
    string[] | null,
    string[] | null,
    string[] | null
  ] = await Promise.all([
    getDailys("actives"),
    getDailys("winners"),
    getDailys("losers"),
  ]);

  return (
    <div className="m-1 mb-7 f-col gap-6">
      <div className="f-col md:flex-row items-center justify-between gap-4 p-4 md:gap-7 md:p-7">
        <Suspense fallback={<StockHighlightLoading />}>
          {/* @ts-expect-error Server Component */}
          <StockHighlight symbol={actives ? actives[0] : null} />
        </Suspense>
        <Suspense fallback={<IndexListLoading />}>
          {/* @ts-expect-error Server Component */}
          <IndexList />
        </Suspense>
        <Suspense fallback={<IndexListLoading />}>
          {/* @ts-expect-error Server Component */}
          <IndexList />
        </Suspense>
      </div>

      <div className="mx-3 f-col">
        <p className="ml-1 mt-3 text-[23px] font-medium">Most Active</p>
        <Suspense fallback={<StockCardListLoading />}>
          {/* @ts-expect-error Server Component */}
          {actives && <StockCardList symbols={actives} />}
        </Suspense>
      </div>
      <div className="mx-3 f-col">
        <p className="ml-1 mt-3 text-[23px] font-medium">Daily Winners</p>
        <Suspense fallback={<StockCardListLoading />}>
          {/* @ts-expect-error Server Component */}
          {winners && <StockCardList symbols={winners} />}
        </Suspense>
      </div>
      <div className="mx-3 f-col">
        <p className="ml-1 mt-3 text-[23px] font-medium">
          Daily Underperformers
        </p>
        <Suspense fallback={<StockCardListLoading />}>
          {/* @ts-expect-error Server Component */}
          {losers && <StockCardList symbols={losers} />}
        </Suspense>
      </div>
    </div>
  );
}
