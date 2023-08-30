import ChartLine from "./chart-line";
import ChartBar from "./chart-bar";
import { Financials } from "@prisma/client";
import { Years } from "@/lib/utils";
import { StructureProps } from "@/types/layout";
import axios from "axios";

interface SharedProps {
  className?: string;
}

interface Props extends SharedProps {
  symbol: string;
}

function Structure({ className, children }: StructureProps) {
  return (
    <div className={`f-col gap-4 lg:flex-row ${className}`}>{children}</div>
  );
}

export function StockStatisticsLoading({ className }: SharedProps) {
  return (
    <Structure className={className}>
      <div className="animate-pulse-right h-[340px] w-[500px] flex-1 animate-appear-up rounded-lg bg-slate-200 p-3 px-6 dark:bg-moon-400"></div>
      <div className="animate-pulse-right h-[340px] w-[500px] flex-1 animate-appear-up rounded-lg bg-slate-200 p-3 px-6 dark:bg-moon-400"></div>
      <div className="animate-pulse-right h-[340px] w-[500px] flex-1 animate-appear-up rounded-lg bg-slate-200 p-3 px-6 dark:bg-moon-400"></div>
    </Structure>
  );
}

export default async function StockStatistics({ symbol, className }: Props) {
  const fin = (await axios.post("/api/stock/financials", {
    symbol,
  })) as Financials[];
  if (!fin) return null;

  const startYear = 2015;
  const labels = Years(startYear);

  const statConfig = [
    {
      name: "P/E Ratio",
      uv: fin.map((financials: Financials) => financials.peRatio),
      pv: labels,
    },
    {
      name: "EPS",
      uv: fin.map((financials: Financials) => financials.eps),
      pv: labels,
    },
    {
      name: "P/B Ratio",
      uv: fin.map((financials: Financials) => financials.pbRatio),
      pv: labels,
    },
  ];

  const marginConfig = [
    {
      name: "Gross Margin",
      uv: fin.map((financials: Financials) => financials.grossProfitMargin),
      pv: labels,
    },
    {
      name: "Operating Margin",
      uv: fin.map((financials: Financials) => financials.operatingProfitMargin),
      pv: labels,
    },
    {
      name: "Profit Margin",
      uv: fin.map((financials: Financials) => financials.netProfitMargin),
      pv: labels,
    },
  ];

  const dividendConfig = [
    {
      name: "Dividend %",
      uv: fin.map((financials: Financials) => financials.dividendYield),
      pv: labels,
    },
  ];

  return (
    <Structure className={className}>
      <ChartLine title="Statistics" labels={labels} data={statConfig} />
      <ChartBar
        title="Margins"
        labels={labels}
        data={marginConfig}
        labelType="percent"
      />
      {/* If company never payed dividends */}
      {fin
        .map((financials: Financials) => financials.dividendYield)
        .filter((d) => d !== 0 && d !== undefined && d !== null).length ===
      0 ? (
        <div className="h-[340px] w-[500px] flex-1 animate-appear-up rounded-lg bg-slate-200 p-3 px-6 dark:bg-moon-400">
          <p className="mb-1 text-[19px] font-medium">Dividends</p>
          <div className="f-box ml-0.5 h-4/5 gap-4">
            <p className="text-xl text-gray-400 dark:text-gray-600 font-medium">
              Never Payed Dividends
            </p>
          </div>
        </div>
      ) : (
        <StockLineChart
          title="Dividend"
          labels={labels}
          data={dividendConfig}
          labelType="percent"
        />
      )}
    </Structure>
  );
}
