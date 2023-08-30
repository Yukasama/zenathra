import { StockChartLoading } from "@/components/chart-line";
import StockList, { StockListLoading } from "@/components/stock-list";
import StockMetrics from "@/components/stock-metrics";
import StockEye from "@/components/stock-eye";
import StockStatistics, {
  StockStatisticsLoading,
} from "@/components/stock-statistics";
import StockAfterHours, {
  StockAfterHoursLoading,
} from "@/components/stock-after-hours";
import StockPrice2, { StockPrice2Loading } from "@/components/stock-price-2";
import { Suspense } from "react";
import { getAuthSession } from "@/lib/auth";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import StockChartLoader from "@/components/stock-chart-loader";

// export async function generateStaticParams() {
//   const symbols = await db.stock.findMany({
//     select: {
//       symbol: true,
//     },
//   });

//   return symbols.map((symbol) => {
//     return {
//       params: {
//         symbol: symbol,
//       },
//     };
//   });
// }

interface Props {
  params: { symbol: string };
}

export default async function Symbol({ params: { symbol } }: Props) {
  const [session, stock, stockWithPeers] = await Promise.all([
    getAuthSession(),
    db.stock.findFirst({
      where: { symbol: symbol },
    }),
    db.stock.findFirst({
      where: { symbol: symbol },
      select: {
        peers: {
          select: {
            id: true,
          },
        },
      },
    }),
  ]);

  if (!stock) return notFound();

  return (
    <div className="m-4 overflow-x-hidden">
      <div className="flex w-full">
        <div className="w-full">
          <div className="flex items-center gap-10 border-b border-slate-300 pb-4 dark:border-moon-100">
            <div className="relative f-col gap-2">
              <Suspense fallback={<StockPrice2Loading />}>
                <StockPrice2 session={session} stock={stock} />
              </Suspense>
              <Suspense fallback={<StockAfterHoursLoading />}>
                <StockAfterHours stock={stock} />
              </Suspense>
            </div>
            <StockMetrics stock={stock} />
            <StockEye stock={stock} session={session} />
          </div>
          <div className="my-4 flex gap-4 border-b border-slate-300 pb-4 dark:border-moon-100">
            <Suspense fallback={<StockChartLoading />}>
              <StockChartLoader symbol={symbol} />
            </Suspense>
            <Suspense
              fallback={<StockListLoading title="Peers" className="wrapper" />}>
              <StockList
                stockIds={stockWithPeers?.peers
                  .map((peer) => peer.id)
                  .slice(0, 5)}
                title="Peers"
                error="No Peers found"
                className="wrapper"
              />
            </Suspense>
          </div>
        </div>
      </div>
      <Suspense fallback={<StockStatisticsLoading />}>
        <StockStatistics symbol={symbol} />
      </Suspense>
    </div>
  );
}
