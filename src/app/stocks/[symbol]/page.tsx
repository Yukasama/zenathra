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
import { getAuthSession } from "@/lib/auth";
import { Session } from "next-auth";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";

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
  const [session, stock]: [Session | null, Stock | null] = await Promise.all([
    getAuthSession(),
    db.stock.findFirst({
      where: { symbol: symbol },
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
                {/* @ts-expect-error Server Component */}
                <StockPrice2 session={session} stock={stock} />
              </Suspense>
              <Suspense fallback={<StockAfterHoursLoading />}>
                {/* @ts-expect-error Server Component */}
                <StockAfterHours stock={stock} />
              </Suspense>
            </div>
            <StockMetrics stock={stock} />
            <StockEye stock={stock} user={session} />
          </div>
          <div className="my-4 flex gap-4 border-b border-slate-300 pb-4 dark:border-moon-100">
            <Suspense fallback={<StockChartLoading />}>
              {/* @ts-expect-error Server Component */}
              <StockChartLoader symbol={symbol} />
            </Suspense>
            <Suspense
              fallback={<StockListLoading title="Peers" className="wrapper" />}>
              {/* @ts-expect-error Server Component */}
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
