import StockMarginChart from "./stock-margin-chart";
import { Stock } from "@prisma/client";
import { Years } from "@/lib/utils";
import { StructureProps } from "@/types/layout";
import React from "react";
import { db } from "@/lib/db";
import StockKeyMetricsChart from "./stock-key-metrics-chart";
import StockDividendChart from "./stock-dividend-chart";

interface SharedProps extends React.HTMLAttributes<HTMLDivElement> {}

interface Props extends SharedProps {
  stock: Pick<Stock, "symbol" | "companyName">;
}

function Structure({ className, children }: StructureProps) {
  return (
    <div className={`f-col gap-5 lg:flex-row ${className}`}>{children}</div>
  );
}

export function StockStatisticsLoading({ className }: SharedProps) {
  return (
    <Structure className={className}>
      <div className="animate-pulse-right h-[340px] w-[500px] flex-1 rounded-lg bg-slate-200 p-3 px-6 dark:bg-zinc-400"></div>
      <div className="animate-pulse-right h-[340px] w-[500px] flex-1 rounded-lg bg-slate-200 p-3 px-6 dark:bg-zinc-400"></div>
      <div className="animate-pulse-right h-[340px] w-[500px] flex-1 rounded-lg bg-slate-200 p-3 px-6 dark:bg-zinc-400"></div>
    </Structure>
  );
}

export default async function StockStatistics({ stock, className }: Props) {
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
    <Structure className={className}>
      <StockKeyMetricsChart companyName={stock.companyName} data={statConfig} />
      <StockMarginChart companyName={stock.companyName} data={marginConfig} />
      <StockDividendChart
        companyName={stock.companyName}
        data={dividendConfig}
      />
    </Structure>
  );
}
