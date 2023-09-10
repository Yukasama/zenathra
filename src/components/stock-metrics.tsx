import { Stock } from "@prisma/client";
import { Card } from "./ui/card";
import { LineChart } from "lucide-react";

interface Props {
  stock: Stock | null;
}

export default function StockMetrics({ stock }: Props) {
  const data = [
    {
      title: "P/E Ratio",
      value: stock ? stock.peRatioTTM.toFixed(2) : "N/A",
      good: stock && stock.peRatioTTM < 20,
    },
    {
      title: "Earnings Per Share",
      value: stock ? stock.netIncomePerShareTTM?.toFixed(2) : "N/A",
      good: stock && stock.netIncomePerShareTTM > 1,
    },
    {
      title: "P/B Ratio",
      value: stock ? stock.priceToBookRatioTTM.toFixed(2) : "N/A",
      good: stock && stock.priceToBookRatioTTM < 3,
    },
  ];

  return (
    <Card className="f-col py-1">
      <div className="mt-3">
        {data.map((d) => (
          <div
            key={d.title}
            className="flex animate-appear-up items-center gap-2 p-2 px-5 hover:bg-gray-100 transition-colors duration-150">
            <p className="w-40 text-[15px] text-slate-500 dark:text-slate-200">
              {d.title}
            </p>
            <p
              className={`font-medium flex items-center ${
                d.good ? "text-green-500" : "text-red-500"
              }`}>
              {d.value !== "N/A" && (
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
        ))}
      </div>
    </Card>
  );
}
