import StockList from "@/components/stock-list";
import StockMetrics from "@/components/stock-metrics";
import StockEye from "@/components/stock-eye";
import StockAfterHours, {
  StockAfterHoursLoading,
} from "@/components/stock-after-hours";
import StockPrice2, { StockPrice2Loading } from "@/components/stock-price-2";
import { Suspense } from "react";
import { getAuthSession } from "@/lib/auth";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import StockChartLoader from "@/components/stock-chart-loader";
import StockPriceChart from "@/components/stock-price-chart";
import { Separator } from "@/components/ui/separator";
import PageLayout from "@/components/shared/page-layout";

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

export default async function page({ params: { symbol } }: Props) {
  const [session, stock] = await Promise.all([
    getAuthSession(),
    db.stock.findFirst({
      where: { symbol: symbol },
    }),
  ]);

  if (!stock) return notFound();

  return (
    <PageLayout>
      <div className="w-full f-col gap-3">
        <div className="flex gap-5">
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
        <Separator />
        <div className="flex items-center gap-5">
          <Suspense fallback={<p>Loading...</p>}>
            <StockPriceChart symbol={symbol} />
          </Suspense>
          <Suspense fallback={<Card />}>
            <StockList
              symbols={stock?.peersList?.split(",")}
              title="Peers"
              description="Companies in the same industry"
              error="No Peers found"
            />
          </Suspense>
        </div>
        <Separator />
      </div>
    </PageLayout>
  );
}
