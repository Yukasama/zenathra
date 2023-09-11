import ChartBar from "./charts/stock-margin-chart";
import { Financials, Stock } from "@prisma/client";
import { Years } from "@/lib/utils";
import { StructureProps } from "@/types/layout";
import ChartArea from "./chart-area";
import React from "react";
import { db } from "@/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

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
      <div className="animate-pulse-right h-[340px] w-[500px] flex-1 animate-appear-up rounded-lg bg-slate-200 p-3 px-6 dark:bg-zinc-400"></div>
      <div className="animate-pulse-right h-[340px] w-[500px] flex-1 animate-appear-up rounded-lg bg-slate-200 p-3 px-6 dark:bg-zinc-400"></div>
      <div className="animate-pulse-right h-[340px] w-[500px] flex-1 animate-appear-up rounded-lg bg-slate-200 p-3 px-6 dark:bg-zinc-400"></div>
    </Structure>
  );
}

export default async function StockStatistics({ stock, className }: Props) {
  const fin = await db.financials.findMany({
    where: { symbol: stock.symbol },
    orderBy: { date: "asc" },
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
      <ChartArea
        title="Key Ratios"
        description={`Important Metrics for ${stock.companyName}`}
        data={statConfig}
        height={230}
      />
      <ChartBar
        title="Margins"
        description={`Margin Data for ${stock.companyName}`}
        data={marginConfig}
        height={230}
      />
      {dividendConfig.some((d) => d.uv !== 0) ? (
        <Card className="w-[500px] flex-1">
          <CardHeader>
            <CardTitle>Dividends</CardTitle>
            <CardDescription>
              Dividend Data for {stock.companyName}
            </CardDescription>
          </CardHeader>
          <CardContent className="f-box">
            <p className="text-xl text-slate-400 font-medium mt-20">
              Never Payed Dividends
            </p>
          </CardContent>
        </Card>
      ) : (
        <ChartArea
          title="Dividend"
          description={`Dividend Data for ${stock.companyName}`}
          data={dividendConfig}
          height={230}
        />
      )}
    </Structure>
  );
}
