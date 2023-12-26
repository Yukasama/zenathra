import MarginChart from "./margin-chart";
import { Stock } from "@prisma/client";
import { db } from "@/db";
import MetricsChart from "./metrics-chart";
import DividendChart from "./dividend-chart";
import Skeleton from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SkeletonText } from "@/components/ui/skeleton";

export function StockStatisticsLoading() {
  return (
    <div className="grid grid-cols-3 gap-5 h-[350px]">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="w-full">
          <CardHeader className="items-start">
            <SkeletonText />
          </CardHeader>
          <CardContent className="w-full h-full">
            <Skeleton>
              <div className="h-[150px]"></div>
            </Skeleton>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

interface Props {
  stock: Pick<Stock, "symbol" | "companyName">;
}

export default async function Statistics({ stock }: Props) {
  const financials = await db.financials.findMany({
    select: {
      peRatio: true,
      eps: true,
      pbRatio: true,
      grossProfitMargin: true,
      operatingProfitMargin: true,
      netProfitMargin: true,
      dividendYield: true,
    },
    where: { symbol: stock.symbol },
    orderBy: { date: "desc" },
    take: 8,
  });

  if (!financials) {
    return null;
  }

  const currentYear = new Date().getFullYear();
  const startYear = currentYear - financials.length;
  const chartYearRange = Math.max(2015, startYear);

  const labels = Array.from({ length: currentYear - chartYearRange }, (_, i) =>
    (chartYearRange + i).toString()
  );

  const statConfig = labels.map((label, index) => ({
    name: label,
    pe: financials[financials.length - 1 - index].peRatio,
    pb: financials[financials.length - 1 - index].pbRatio,
    eps: financials[financials.length - 1 - index].eps,
  }));

  const marginConfig = labels.map((label, index) => ({
    name: label,
    gm: financials[financials.length - 1 - index].grossProfitMargin,
    om: financials[financials.length - 1 - index].operatingProfitMargin,
    pm: financials[financials.length - 1 - index].netProfitMargin,
  }));

  const dividendConfig = labels.map((label, index) => ({
    name: label,
    div: financials[financials.length - 1 - index].dividendYield,
  }));

  return (
    <div className="f-col md:grid grid-cols-2 gap-6 sm:gap-8 py-3 sm:py-6">
      <div className="f-col items-center gap-1">
        <MetricsChart data={statConfig} />
        <p className="text-sm text-zinc-400">
          Key Metrics for {stock.companyName}
        </p>
      </div>
      <div className="f-col items-center gap-1">
        <MarginChart data={marginConfig} />
        <p className="text-sm text-zinc-400">Margins for {stock.companyName}</p>
      </div>
      <div className="f-col items-center gap-1">
        <DividendChart data={dividendConfig} />
        <p className="text-sm text-zinc-400">
          Dividend Yield for {stock.companyName}
        </p>
      </div>
    </div>
  );
}
