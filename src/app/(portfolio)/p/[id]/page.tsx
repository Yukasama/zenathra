import { Suspense } from "react";
import { db } from "@/db";
import { notFound } from "next/navigation";
import { PortfolioAssetsLoading } from "@/app/(portfolio)/p/[id]/portfolio-assets";
import PortfolioAllocation from "@/app/(portfolio)/p/[id]/portfolio-allocation";
import NewAssets from "./new-assets";
import { getQuotes } from "@/lib/fmp/quote";
import PortfolioChart from "./portfolio-chart";

interface Props {
  params: { id: string };
}

export default async function page({ params: { id } }: Props) {
  const portfolio = await db.portfolio.findFirst({
    select: {
      id: true,
      title: true,
      public: true,
      creatorId: true,
      createdAt: true,
      stocks: {
        select: { stockId: true },
      },
    },
    where: { id },
  });

  if (!portfolio) {
    return notFound();
  }

  const stocks = await db.stock.findMany({
    select: {
      id: true,
      symbol: true,
      companyName: true,
      image: true,
      peRatioTTM: true,
      sector: true,
    },
    where: {
      id: { in: portfolio.stocks.map((s) => s.stockId) },
    },
  });

  const quotes = await getQuotes(stocks.map((stock) => stock.symbol));

  const results = stocks.map((stock) => ({
    ...stock,
    ...quotes?.find((q) => q.symbol === stock.symbol),
  }));

  return (
    <div className="f-col gap-6">
      <div className="f-col lg:flex-row gap-4">
        <PortfolioChart
          portfolioId={id}
          portfolioCreatedAt={portfolio.createdAt.toDateString()}
          title="Portfolio Chart"
          description="Chart of all portfolio positions"
        />
        <PortfolioAllocation stocks={stocks} />
      </div>
      <div className="flex">
        <Suspense fallback={<PortfolioAssetsLoading />}>
          <NewAssets stocks={stocks} />
        </Suspense>
      </div>
    </div>
  );
}
