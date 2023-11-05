import { Suspense } from "react";
import PriceChart from "@/components/stock/price-chart";
import { db } from "@/db";
import { notFound } from "next/navigation";
import { PortfolioAssetsLoading } from "@/app/p/[id]/portfolio-assets";
import PortfolioAllocation from "@/app/p/[id]/portfolio-allocation";
import NewAssets from "./new-assets";

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

  if (!portfolio) return notFound();

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

  return (
    <div className="f-col gap-6">
      <div className="f-col lg:flex-row gap-4">
        <PriceChart
          symbols={stocks.map((s) => s.symbol)}
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
