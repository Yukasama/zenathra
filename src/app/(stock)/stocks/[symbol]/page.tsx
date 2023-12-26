import StockList, { StockListLoading } from "@/components/stock/stock-list";
import StockMetrics from "@/app/(stock)/stocks/[symbol]/stock-metrics";
import StockEye from "@/app/(stock)/stocks/[symbol]/stock-eye";
import StockInfo from "@/app/(stock)/stocks/[symbol]/price";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { Separator } from "@/components/ui/separator";
import PageLayout from "@/components/shared/page-layout";
import StockStatistics, {
  StockStatisticsLoading,
} from "@/app/(stock)/stocks/[symbol]/stock-statistics";
import PriceChart from "@/components/stock/price-chart";
import StockImage from "@/components/stock/stock-image";
import { getUser } from "@/lib/auth";
import { getQuote } from "@/lib/fmp/quote";
import { StockQuote } from "@/types/stock";
import { formatMarketCap } from "@/lib/utils";
import StockPortfolioAddModal from "@/components/stock/stock-portfolio-add-modal";
import { Card, Chip } from "@nextui-org/react";
import Link from "next/link";
import Price from "@/app/(stock)/stocks/[symbol]/price";
import StockKeyMetricsChart from "./stock-key-metrics-chart";

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

  if (!stock || !quote) {
    return {
      title: "Stock not found",
      description: "No market data available for this stock symbol",
    };
  }

  const pos = quote?.changesPercentage >= 0;
  const direction = pos ? "▲" : "▼";

  return {
    title: `${quote?.symbol} ${quote?.price?.toFixed(2)} ${direction} ${
      pos ? "+" : ""
    }${quote?.changesPercentage?.toFixed(2)}%`,
  };
}

export default async function page({ params: { symbol } }: Props) {
  const user = await getUser();

  const [stock, portfolios] = await Promise.all([
    db.stock.findFirst({
      select: {
        id: true,
        symbol: true,
        website: true,
        companyName: true,
        image: true,
        description: true,
        eye: true,
        mktCap: true,
        sector: true,
        country: true,
        industry: true,
        peRatioTTM: true,
        netIncomePerShareTTM: true,
        priceToBookRatioTTM: true,
        peersList: true,
      },
      where: { symbol },
    }),
    db.portfolio.findMany({
      select: {
        id: true,
        title: true,
        color: true,
        isPublic: true,
        stocks: {
          select: { stockId: true },
        },
      },
      where: { creatorId: user?.id },
    }),
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
        userId: user.id,
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

  const attributes = [stock.sector, stock.industry, stock.country];

  const metrics = [
    {
      title: "Market Cap",
      value: formatMarketCap(stock.mktCap),
    },
    {
      title: "P/E Ratio",
      value: stock.peRatioTTM?.toFixed(2),
    },
    {
      title: "P/B Ratio",
      value: stock.priceToBookRatioTTM?.toFixed(2),
    },
    {
      title: "EPS",
      value: stock.netIncomePerShareTTM?.toFixed(2),
    },
  ];

  const values = [
    { title: "Fundamental", gradient: ["#fda37a", "#ffcc5e"], value: 67 },
    { title: "Shark4", gradient: ["#47FCA7", "#00FFDE"], value: 78 },
    { title: "Technical", gradient: ["#0088FF", "#5947FC"], value: 94 },
  ];

  return (
    <PageLayout className="f-col xl:grid grid-cols-5 gap-8 mx-3 xl:m-10">
      <div className="col-span-1"></div>

      <div className="col-span-3 f-col gap-8">
        <div className="f-col gap-6 sm:gap-8">
          <div className="f-col gap-3">
            <div className="f-col md:flex-row justify-between gap-3 md:gap-5">
              <div className="flex items-center gap-4">
                <Link href={`${stock.website}`}>
                  <StockImage src={stock.image} px={50} />
                </Link>
                <div>
                  <p className="font-semibold text-2xl">{stock.companyName}</p>
                  <p className="text-zinc-400">{stock.symbol}</p>
                </div>
                <div className="mb-5 ml-1">
                  <StockPortfolioAddModal
                    stock={stock}
                    isAuth={!!user}
                    portfolios={portfolios}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                {values.map((value, i) => (
                  <StockEye
                    key={i}
                    user={user}
                    title={value.title}
                    value={value.value}
                    gradient={value.gradient}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              {attributes.map((attribute) => (
                <Chip
                  key={attribute}
                  variant="shadow"
                  classNames={{
                    base: "bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30",
                    content: "drop-shadow shadow-black text-white",
                  }}>
                  {attribute}
                </Chip>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <Price stock={stock} />

            <div className="grid grid-cols-2 md:flex md:items-center gap-3 md:gap-5 lg:gap-7 px-2">
              {metrics.map((metric) => (
                <div key={metric.title}>
                  <p className="font-semibold">{metric.title}</p>
                  <p className="text-zinc-400 text-[15px]">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <PriceChart symbol={symbol} />

        <div className="f-col gap-1">
          <h2 className="font-light text-2xl">Statistics</h2>
          <Separator />
          <StockStatistics stock={stock} />
        </div>

        <div className="f-col gap-1">
          <h2 className="font-light text-2xl">About</h2>
          <Separator />
        </div>

        <Card className="p-4 line-clamp-3">
          <p className="line-clamp-3">{stock.description}</p>
        </Card>
      </div>

      <div className="col-span-1"></div>
    </PageLayout>
  );
}
