import { Stock } from "@prisma/client";
import { Card } from "../../../../components/ui/card";
import { LineChart } from "lucide-react";

interface Props {
  stock: Pick<Stock, "peRatioTTM" | "netIncomePerShareTTM" | "priceToBookRatioTTM"> | null;
}

export default function StockMetrics({ stock }: Props) {
  const data = [
    {
      title: "P/E Ratio",
      value: stock?.peRatioTTM?.toFixed(2) ?? "N/A",
      good: stock?.peRatioTTM ?? 0 < 20,
    },
    {
      title: "Earnings Per Share",
      value: stock?.netIncomePerShareTTM?.toFixed(2) ?? "N/A",
      good: stock?.netIncomePerShareTTM ?? 0 > 1,
    },
    {
      title: "P/B Ratio",
      value: stock?.priceToBookRatioTTM?.toFixed(2) ?? "N/A",
      good: stock?.priceToBookRatioTTM ?? 0 < 3,
    },
  ];

  return (
    <Card className="f-col py-1 bg-zinc-50 dark:bg-zinc-900/70 border-none">
      <div className="sm:mt-3">
        {data.map((d) => (
          <div
            key={d.title}
            className="flex items-center gap-2 p-2 px-5 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors duration-150"
          >
            <p className="w-40 text-[15px] text-zinc-500 dark:text-zinc-200">{d.title}</p>
            <p className={`font-medium flex items-center ${d.good ? "text-green-500" : "text-red-500"}`}>
              {d.value !== "N/A" && (
                <span className="ml-2">
                  {d.good ? <LineChart className="h-4 text-green-500" /> : <LineChart className="h-4 text-red-500" />}
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
