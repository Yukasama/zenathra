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
    <div className="grid grid-cols-3 gap-5 h-[350px]">
      <Skeleton>
        <div className="w-full"></div>
      </Skeleton>
      <Skeleton>
        <div className="w-full"></div>
      </Skeleton>
      <Skeleton>
        <div className="w-full"></div>
      </Skeleton>
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

  if (!financials) return null;

  const startYear = new Date().getFullYear() - financials.length;
  const labels = Years(startYear < 2015 ? 2015 : startYear);

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
