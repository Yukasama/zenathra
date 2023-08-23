import {
  StockChartLoading,
  StockList,
  StockListLoading,
  StockMetrics,
  StockEye,
  StockStatistics,
  StockAfterHours,
  StockPrice2,
  StockStatisticsLoading,
  StockAfterHoursLoading,
  StockPrice2Loading,
  StockChartLoader,
} from "@/components";
import { Stock } from "@prisma/client";
import { Suspense } from "react";
import notFound from "@/app/not-found";
import { User } from "@/types/db";

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
  const [user, stock]: [User | null, Stock | null] = await Promise.all([
    getUser(),
    getStock(symbol),
  ]);

  if (!stock) return notFound();

  return (
    <div className="m-4 overflow-x-hidden">
      <div className="flex w-full">
        <div className="w-full">
          <div className="flex items-center gap-10 border-b border-slate-300 pb-4 dark:border-moon-100">
            <div className="relative f-col gap-2">
              <Suspense fallback={<StockPrice2Loading />}>
                <StockPrice2 user={user} stock={stock} />
              </Suspense>
              <Suspense fallback={<StockAfterHoursLoading />}>
                <StockAfterHours stock={stock} />
              </Suspense>
            </div>
            <StockMetrics stock={stock} />
            <StockEye stock={stock} user={user} />
          </div>
          <div className="my-4 flex gap-4 border-b border-slate-300 pb-4 dark:border-moon-100">
            <Suspense fallback={<StockChartLoading />}>
              <StockChartLoader symbol={symbol} />
            </Suspense>
            <Suspense
              fallback={<StockListLoading title="Peers" className="wrapper" />}>
              <StockList
                symbols={stock.peersList.slice(0, 5)}
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
