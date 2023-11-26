import StockMarginChart from "./stock-margin-chart";
import { Stock } from "@prisma/client";
import React from "react";
import { db } from "@/db";
import StockKeyMetricsChart from "./stock-key-metrics-chart";
import StockDividendChart from "./stock-dividend-chart";
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
              <div className="h-[250px]"></div>
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

export default async function StockStatistics({ stock }: Props) {
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
    uv: financials[financials.length - 1 - index].peRatio,
    pv: financials[financials.length - 1 - index].eps,
    fv: financials[financials.length - 1 - index].pbRatio,
  }));

  const marginConfig = labels.map((label, index) => ({
    name: label,
    uv: financials[financials.length - 1 - index].grossProfitMargin,
    pv: financials[financials.length - 1 - index].operatingProfitMargin,
    fv: financials[financials.length - 1 - index].netProfitMargin,
  }));

  const dividendConfig = labels.map((label, index) => ({
    name: label,
    uv: financials[financials.length - 1 - index].dividendYield,
  }));

  return (
    <div className="f-col items-start lg:items-start gap-4 lg:flex-row">
      <StockKeyMetricsChart stock={stock} data={statConfig} />
      <StockMarginChart stock={stock} data={marginConfig} />
      <StockDividendChart stock={stock} data={dividendConfig} />
    </div>
  );
}
