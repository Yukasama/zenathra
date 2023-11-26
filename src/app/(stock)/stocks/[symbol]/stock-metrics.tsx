import { Stock } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { LineChart } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  stock: Pick<
    Stock,
    "peRatioTTM" | "netIncomePerShareTTM" | "priceToBookRatioTTM"
  > | null;
}

export default function StockMetrics({ stock }: Props) {
  const data = [
    {
      title: "P/E Ratio",
      value: stock?.peRatioTTM?.toFixed(2),
      good: stock?.peRatioTTM ?? 0 < 20,
      tooltip:
        "The P/E ratio compares a company's share price to per-share earnings.",
    },
    {
      title: "Earnings Per Share",
      value: stock?.netIncomePerShareTTM?.toFixed(2),
      good: stock?.netIncomePerShareTTM ?? 0 > 1,
      tooltip: "EPS measures a company's profit allocated to each stock share.",
    },
    {
      title: "P/B Ratio",
      value: stock?.priceToBookRatioTTM?.toFixed(2),
      good: stock?.priceToBookRatioTTM ?? 0 < 3,
      tooltip:
        "The P/B ratio compares a company's market capitalization to its book value.",
    },
  ];

  return (
    <Card className="f-box">
      <div className="p-2 f-col gap-2">
        {data.map((d) => (
          <TooltipProvider key={d.title}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 p-2 px-5 bg-item hover:bg-item-hover transition-colors duration-150 rounded-md">
                  <p className="w-40 text-[15px] text-zinc-500 dark:text-zinc-200">
                    {d.title}
                  </p>
                  <p
                    className={`font-medium flex items-center ${
                      d.good ? "text-green-500" : "text-red-500"
                    }`}>
                    {d.value && (
                      <span className="ml-2">
                        {d.good ? (
                          <LineChart className="h-4 text-green-500" />
                        ) : (
                          <LineChart className="h-4 text-red-500" />
                        )}
                      </span>
                    )}
                    {d.value}
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">{d.tooltip}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </Card>
  );
}
