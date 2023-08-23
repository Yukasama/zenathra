"use client";

import {
  Chart,
  LinearScale,
  Filler,
  CategoryScale,
  PointElement,
  LineElement,
  ScriptableContext,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { corsairPlugin, chartOptions } from "@/config/chart-options";
import { AllHistory, History, Quote, TimeFrame } from "@/types/stock";
import { Loader, StockChartStructure } from "@/components";
import { TrendingDown, TrendingUp } from "react-feather";

Chart.register(
  LinearScale,
  CategoryScale,
  Filler,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

interface Props {
  history: AllHistory | History[] | null;
  quote?: Quote;
  showPrice?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const isAllHistory = (obj: AllHistory | History[]): obj is AllHistory => {
  return (obj as AllHistory)["1D"] !== undefined;
};

export default function StockPriceChart({
  history,
  quote,
  showPrice = false,
  size = "lg",
  className,
}: Props) {
  const timeFrames: TimeFrame[] = ["1D", "5D", "1M", "6M", "1Y", "5Y", "ALL"];
  const [time, setTime] = useState<TimeFrame>("1D");
  const [his, setHis] = useState<History[] | null>();

  useEffect(() => {
    if (!history) return;
    if (isAllHistory(history)) setHis(history[time]);
    else setHis(history);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  if (!history)
    return (
      <StockChartStructure size={size}>
        <p className="text-xl font-medium text-slate-600">
          Chart Could Not Be Loaded
        </p>
      </StockChartStructure>
    );

  let isAll: boolean = isAllHistory(history);
  const positive = quote ? quote.changesPercentage > 0 : false;

  const data: any = {
    labels:
      time === "1D"
        ? his?.map((h: History) =>
            h.date.split(" ")[1].split(":").slice(0, 2).join(":")
          )
        : his?.map((h: History) => h.date.split(" ")[0]),
    datasets: [
      {
        label: "Price",
        data: his?.map((h: History) => h.close),
        borderColor: "rgba(0, 200, 100, 0.6)",
        backgroundColor: (context: ScriptableContext<"line">) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 280);
          gradient.addColorStop(0, `rgba(0, 200, 100, 0.5)`);
          gradient.addColorStop(1, `rgba(0, 200, 100, 0.05)`);
          return gradient;
        },
        pointRadius: 0,
        pointHitRadius: 0,
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,
        pointHoverRadius: 0,
        fill: true,
      },
    ],
  };

  return (
    <StockChartStructure>
      <div
        className={`flex ${
          showPrice ? "justify-between" : "justify-end"
        }  items-center pr-5 pt-5 md:p-4`}>
        {showPrice && (
          <div className="ml-7 flex items-center gap-2">
            <p className="text-md font-light md:text-xl ">
              ${quote ? quote.price.toFixed(2) : "N/A"}
            </p>
            <div
              className={`flex items-center gap-1.5 p-2 py-1 ${
                positive
                  ? "bg-green-500/20 text-green-500"
                  : "bg-red-500/20 text-red-500"
              } rounded-md`}>
              {positive ? (
                <TrendingUp className="mt-[1px] h-3 w-3 text-green-500 md:h-4 md:w-4" />
              ) : (
                <TrendingDown className="mt-[1px] h-3 w-3 text-red-500 md:h-4 md:w-4" />
              )}
              <p
                className={`mb-[1px] text-[12px] md:text-sm ${
                  positive ? "text-green-500" : "text-red-500"
                }`}>
                {quote ? quote.changesPercentage.toFixed(2) : "N/A"}%
              </p>
            </div>
          </div>
        )}

        <div className="hidden h-[30px] items-center gap-1 rounded-md dark:bg-moon-400 dark:text-slate-300 md:flex">
          {isAll &&
            timeFrames.map((frame: any, i) => (
              <button
                key={i}
                onClick={() => setTime(frame)}
                className={`f-box h-full w-[34px] rounded-md 
                text-[13px] ${
                  time === frame
                    ? "bg-blue-500 text-white"
                    : `${
                        isAll
                          ? "bg-slate-300 dark:bg-moon-200"
                          : "bg-slate-100 dark:bg-moon-300"
                      }`
                }`}>
                <p
                  className={`${
                    !isAll && time !== frame && "text-slate-800/50"
                  } ${time === frame && "text-white"}`}>
                  {frame}
                </p>
              </button>
            ))}
        </div>
      </div>
      {!his ? (
        <p>Loading...</p>
      ) : (
        <Line
          className={`${
            size === "lg"
              ? "h-[410px] w-[700px]"
              : size === "md"
              ? "h-[310px] w-[510px]"
              : "h-[190px] w-[270px]"
          } md:px-[15px]`}
          data={data}
          options={chartOptions("price") as any}
          plugins={[corsairPlugin]}
        />
      )}
    </StockChartStructure>
  );
}
