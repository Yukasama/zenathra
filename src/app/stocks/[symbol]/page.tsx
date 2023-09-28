import StockList from "@/components/stock/stock-list";
import StockMetrics from "@/components/stock/stock-metrics";
import StockEye from "@/components/stock/stock-eye";
import StockAfterHours, {
  StockAfterHoursLoading,
} from "@/components/stock/stock-after-hours";
import StockPrice2, {
  StockPrice2Loading,
} from "@/components/stock/stock-price-2";
import { Suspense } from "react";
import { getAuthSession } from "@/lib/auth";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import PageLayout from "@/components/shared/page-layout";
import StockStatistics from "@/components/stock/stock-statistics";
import PriceChart from "@/components/stock/price-chart";
import { StockImage } from "@/components/stock/stock-image";

export const revalidate = 30;

export async function generateStaticParams() {
  const data = await db.stock.findMany({
    select: {
      symbol: true,
    },
  });

  return data.map((stock) => ({ symbol: stock.symbol }));
}

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

  if (session?.user) {
    const tenSecondsAgo = new Date(new Date().getTime() - 10000);
    const recentEntry = await db.userRecentStocks.findFirst({
      where: {
        userId: session.user.id,
        stockId: stock.id,
        createdAt: { gte: tenSecondsAgo },
      },
    });

    if (!recentEntry)
      await db.userRecentStocks.create({
        data: {
          userId: session.user.id,
          stockId: stock.id,
        },
      });
  }

  return (
    <PageLayout>
      <div className="w-full f-col gap-3">
        <div className="flex f-col md:flex-row gap-5">
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
          <StockEye eye={stock.eye} session={session} />
        </div>
        <Separator />
        <div className="flex f-col md:flex-row gap-5">
          <PriceChart
            symbols={symbol}
            title={`${symbol} Chart`}
            description={`Price Chart of ${stock.companyName}`}
            image={<StockImage src={stock.image} px={40} className="bg-card" />}
          />
          <Suspense fallback={<Card />}>
            {/* @ts-expect-error Server Component */}
            <StockList
              symbols={stock?.peersList?.split(",")}
              title="Peers"
              description="Companies in the same industry"
              error="No Peers found"
              limit={4}
            />
          </Suspense>
        </div>
        <Separator />
        <Suspense fallback={<p>Loading...</p>}>
          {/* @ts-expect-error Server Component */}
          <StockStatistics
            stock={{
              symbol: stock.symbol,
              companyName: stock.companyName,
            }}
          />
        </Suspense>
      </div>
    </PageLayout>
  );
}
