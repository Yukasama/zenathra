import { LineChart, BarChart } from "@/components/ui/charts";
import { getFinancials } from "@/lib/stocks/client/getStocks";
import { Financials } from "@prisma/client";
import { Years } from "@/utils/helper";
import { StructureProps } from "@/types/layout";

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

export function StatisticsLoading({ className }: SharedProps) {
  return (
    <Structure className={className}>
      <div className="animate-pulse-right h-[340px] w-[500px] flex-1 animate-appear-up rounded-lg bg-gray-200 p-3 px-6 dark:bg-moon-400"></div>
      <div className="animate-pulse-right h-[340px] w-[500px] flex-1 animate-appear-up rounded-lg bg-gray-200 p-3 px-6 dark:bg-moon-400"></div>
      <div className="animate-pulse-right h-[340px] w-[500px] flex-1 animate-appear-up rounded-lg bg-gray-200 p-3 px-6 dark:bg-moon-400"></div>
    </Structure>
  );
}

export default async function Statistics({ symbol, className }: Props) {
  const fin = await getFinancials(symbol);
  if (!fin) return null;

  const startYear = 2015;
  const labels = Years(startYear);

  const statConfig = [
    {
      label: "P/E Ratio",
      data: fin.map((financials: Financials) => financials.peRatio),
      color: "0, 153, 235",
    },
    {
      label: "EPS",
      data: fin.map((financials: Financials) => financials.eps),
      color: "135, 0, 235",
    },
    {
      label: "P/B Ratio",
      data: fin.map((financials: Financials) => financials.pbRatio),
      color: "0, 255, 150",
    },
  ];

  const marginConfig = [
    {
      label: "Gross Margin",
      data: fin.map((financials: Financials) => financials.grossProfitMargin),
      color: "0, 175, 235",
    },
    {
      label: "Operating Margin",
      data: fin.map(
        (financials: Financials) => financials.operatingProfitMargin
      ),
      color: "0, 115, 245",
    },
    {
      label: "Profit Margin",
      data: fin.map((financials: Financials) => financials.netProfitMargin),
      color: "0, 65, 235",
    },
  ];

  const dividendConfig = [
    {
      label: "Dividend %",
      data: fin.map((financials: Financials) => financials.dividendYield),
      color: "0, 255, 150",
    },
  ];

  return (
    <Structure className={className}>
      <LineChart title="Statistics" labels={labels} data={statConfig} />
      <BarChart
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
        <div className="h-[340px] w-[500px] flex-1 animate-appear-up rounded-lg bg-gray-200 p-3 px-6 dark:bg-moon-400">
          <p className="mb-1 text-[19px] font-medium">Dividends</p>
          <div className="f-box ml-0.5 h-4/5 gap-4">
            <p className="error-text">Never Payed Dividends</p>
          </div>
        </div>
      ) : (
        <LineChart
          title="Dividend"
          labels={labels}
          data={dividendConfig}
          labelType="percent"
        />
      )}
    </Structure>
  );
}
