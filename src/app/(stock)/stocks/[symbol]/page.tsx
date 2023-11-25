import StockList, { StockListLoading } from "@/components/stock/stock-list";
import StockMetrics from "@/app/(stock)/stocks/[symbol]/stock-metrics";
import StockEye from "@/app/(stock)/stocks/[symbol]/stock-eye";
import StockAfterHours, { StockAfterHoursLoading } from "@/app/(stock)/stocks/[symbol]/stock-after-hours";
import StockInfo, { StockInfoLoading } from "@/app/(stock)/stocks/[symbol]/stock-info";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { Separator } from "@/components/ui/separator";
import PageLayout from "@/components/shared/page-layout";
import StockStatistics, { StockStatisticsLoading } from "@/app/(stock)/stocks/[symbol]/stock-statistics";
import PriceChart from "@/components/stock/price-chart";
import StockImage from "@/components/stock/stock-image";
import { getUser } from "@/lib/auth";
import { getQuote } from "@/lib/fmp/quote";
import { StockQuote } from "@/types/stock";

interface Props {
  params: { symbol: string };
}

export async function generateStaticParams() {
  const data = await db.stock.findMany({
    select: { symbol: true },
  });

  return data.map((stock) => ({ symbol: stock.symbol }));
}

export async function generateMetadata({ params: { symbol } }: Props) {
  const [stock, quote] = await Promise.all([
    db.stock.findFirst({
      select: { companyName: true },
      where: { symbol },
    }),
    getQuote(symbol),
  ]);

  if (!stock) {
    return { title: "Stock not found" };
  }

  return { title: `${quote?.symbol} - $${quote?.price}` };
}

export default async function page({ params: { symbol } }: Props) {
  const [stock, user, quote] = await Promise.all([
    db.stock.findFirst({
      select: {
        id: true,
        symbol: true,
        website: true,
        companyName: true,
        image: true,
        eye: true,
        peRatioTTM: true,
        netIncomePerShareTTM: true,
        priceToBookRatioTTM: true,
        peersList: true,
      },
      where: { symbol },
    }),
    getUser(),
    getQuote(symbol),
  ]);

  if (!stock) {
    return notFound();
  }

  // Add stock to user's recent stocks
  if (user) {
    const tenSecondsAgo = new Date(new Date().getTime() - 10000);
    const recentEntry = await db.userRecentStocks.findFirst({
      select: { id: true },
      where: {
        userId: user?.id ?? undefined,
        stockId: stock.id,
        createdAt: { gte: tenSecondsAgo },
      },
    });

    if (!recentEntry) {
      await db.userRecentStocks.create({
        data: {
          userId: user?.id!,
          stockId: stock.id,
        },
      });
    }
  }

  const stockQuote: StockQuote = { ...stock, ...quote };

  return (
    <PageLayout>
      <div className="f-col gap-3">
        {/* Header */}
        <div className="flex f-col md:flex-row gap-4">
          <div className="relative f-col gap-2">
            <Suspense fallback={<StockInfoLoading />}>
              <StockInfo stockQuote={stockQuote} />
            </Suspense>
            <Suspense fallback={<StockAfterHoursLoading />}>
              <StockAfterHours stockQuote={stockQuote} />
            </Suspense>
          </div>
          <div className="f-col lg:flex-row gap-4">
            <StockMetrics stock={stock} />
            <StockEye stock={stock} user={user} />
          </div>
        </div>

        <Separator />

        {/* Chart + Peers */}
        <div className="f-col lg:flex-row gap-4">
          <PriceChart
            symbol={symbol}
            title={`${symbol} Chart`}
            description={`Price Chart of ${stock.companyName}`}
            image={<StockImage src={stock.image} px={40} />}
          />
          <Suspense fallback={<StockListLoading limit={4} />}>
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

        {/* Statistics */}
        <Suspense fallback={<StockStatisticsLoading />}>
          <StockStatistics stock={stock} />
        </Suspense>
      </div>
    </PageLayout>
  );
}
