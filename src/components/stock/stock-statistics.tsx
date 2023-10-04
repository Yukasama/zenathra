import StockMarginChart from "./stock-margin-chart";
import { Stock } from "@prisma/client";
import { Years } from "@/lib/utils";
import React from "react";
import { db } from "@/db";
import StockKeyMetricsChart from "./stock-key-metrics-chart";
import StockDividendChart from "./stock-dividend-chart";
import Skeleton from "../ui/skeleton";

export function StockStatisticsLoading() {
  return (
    <div className="f-col gap-5 lg:flex-row h-[350px]">
      {[Array(3)].map((_, i) => (
        <Skeleton key={i}></Skeleton>
      ))}
    </div>
  );
}

interface Props {
  stock: Pick<Stock, "symbol" | "companyName">;
}

export default async function StockStatistics({ stock }: Props) {
  const fin = await db.financials.findMany({
    where: { symbol: stock.symbol },
    orderBy: { date: "desc" },
    take: 8,
  });

  if (!fin) return null;

  const startYear = new Date().getFullYear() - fin.length;
  const labels = Years(startYear < 2015 ? 2015 : startYear);

  const statConfig = labels.map((label, index) => ({
    name: label,
    uv: fin[fin.length - 1 - index].peRatio,
    pv: fin[fin.length - 1 - index].eps,
    fv: fin[fin.length - 1 - index].pbRatio,
  }));

  const marginConfig = labels.map((label, index) => ({
    name: label,
    uv: fin[fin.length - 1 - index].grossProfitMargin,
    pv: fin[fin.length - 1 - index].operatingProfitMargin,
    fv: fin[fin.length - 1 - index].netProfitMargin,
  }));

  const dividendConfig = labels.map((label, index) => ({
    name: label,
    uv: fin[fin.length - 1 - index].dividendYield,
  }));

  return (
    <div className="f-col gap-5 lg:flex-row">
      <StockKeyMetricsChart companyName={stock.companyName} data={statConfig} />
      <StockMarginChart companyName={stock.companyName} data={marginConfig} />
      <StockDividendChart
        companyName={stock.companyName}
        data={dividendConfig}
      />
    </div>
  );
}
