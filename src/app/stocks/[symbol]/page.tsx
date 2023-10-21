import StockList, { StockListLoading } from "@/components/stock/stock-list";
import StockMetrics from "@/components/stock/stock-metrics";
import StockEye from "@/components/stock/stock-eye";
import StockAfterHours, {
  StockAfterHoursLoading,
} from "@/components/stock/stock-after-hours";
import StockInfo, { StockInfoLoading } from "@/components/stock/stock-info";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { Separator } from "@/components/ui/separator";
import PageLayout from "@/components/shared/page-layout";
import StockStatistics, {
  StockStatisticsLoading,
} from "@/components/stock/stock-statistics";
import PriceChart from "@/components/price-chart";
import { StockImage } from "@/components/stock/stock-image";
import { getUser } from "@/lib/auth";
import { getQuote } from "@/lib/fmp/quote";

export const revalidate = 30;

export async function generateStaticParams() {
  const data = await db.stock.findMany({
    select: { symbol: true },
  });

  return data.map((stock) => ({ symbol: stock.symbol }));
}

interface Props {
  params: { symbol: string };
}

export async function generateMetadata({ params: { symbol } }: Props) {
  const [stock, quote] = await Promise.all([
    db.stock.findFirst({
      select: { companyName: true },
      where: { symbol },
    }),
    getQuote(symbol),
  ]);

  if (!stock) return { title: "Stock not found" };

  return { title: `$${quote?.price} - ${stock.companyName}` };
}

export default async function page({ params: { symbol } }: Props) {
  const stock = await db.stock.findFirst({
    select: {
      id: true,
      symbol: true,
      companyName: true,
      image: true,
      eye: true,
      peRatioTTM: true,
      netIncomePerShareTTM: true,
      priceToBookRatioTTM: true,
      peersList: true,
    },
    where: { symbol: symbol },
  });

  if (!stock) return notFound();

  const user = getUser();

  if (user) {
    const tenSecondsAgo = new Date(new Date().getTime() - 10000);
    const recentEntry = await db.userRecentStocks.findFirst({
      where: {
        userId: user?.id ?? undefined,
        stockId: stock.id,
        createdAt: { gte: tenSecondsAgo },
      },
    });

    if (!recentEntry)
      await db.userRecentStocks.create({
        data: {
          userId: user?.id!,
          stockId: stock.id,
        },
      });
  }

  return (
    <PageLayout>
      <div className="w-full f-col gap-3">
        <div className="flex f-col md:flex-row gap-5">
          <div className="relative f-col gap-2">
            <Suspense fallback={<StockInfoLoading />}>
              {/* @ts-expect-error Server Component */}
              <StockInfo stock={stock} />
            </Suspense>
            <Suspense fallback={<StockAfterHoursLoading />}>
              {/* @ts-expect-error Server Component */}
              <StockAfterHours stock={stock} />
            </Suspense>
          </div>
          <StockMetrics stock={stock} />
          <StockEye eye={stock.eye} user={user} />
        </div>
        <Separator />
        <div className="flex f-col md:flex-row gap-5">
          <PriceChart
            symbols={symbol}
            title={`${symbol} Chart`}
            description={`Price Chart of ${stock.companyName}`}
            image={<StockImage src={stock.image} px={40} className="bg-card" />}
          />
          <Suspense fallback={<StockListLoading limit={4} />}>
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
        <Suspense fallback={<StockStatisticsLoading />}>
          {/* @ts-expect-error Server Component */}
          <StockStatistics stock={stock} />
        </Suspense>
      </div>
    </PageLayout>
  );
}
