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
import { Line } from "react-chartjs-2";
import { chartOptions } from "./chartOptions";
import { StockChart } from "@/types/stock";

Chart.register(
  LinearScale,
  CategoryScale,
  Filler,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function LineChart({
  title,
  labels,
  data,
  labelType,
}: StockChart) {
  const chartData = {
    labels: labels,
    datasets: data.map((c: any) => ({
      label: c.label,
      data: c.data,
      backgroundColor: (context: ScriptableContext<"line">) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 260);
        gradient.addColorStop(0, `rgba(${c.color}, 0.3)`);
        gradient.addColorStop(1, `rgba(${c.color}, 0)`);
        return gradient;
      },
      borderColor: `rgb(${c.color})`,
      pointRadius: c.pointRadius,
      pointHitRadius: c.pointHitRadius,
      pointBorderWidth: c.pointBorderWidth,
      pointBorderColor: "white",
      pointBackgroundColor: `rgb(${c.color})`,
      pointHoverBorderWidth: c.pointHoverBorderWidth,
      pointHoverRadius: c.pointHoverRadius,
      fill: c.fill,
    })),
  };

  return (
    <div className="min-h-[340px] min-w-[500px] flex-1 animate-appear-up rounded-lg bg-gray-200 p-3 px-6 dark:bg-moon-400">
      <p className="mb-1 text-[19px] font-medium">{title}</p>
      <div className="ml-0.5 flex gap-4">
        {data.map((c: any) => (
          <div key={title + c.label} className="flex items-center gap-[5px]">
            <div
              className={`h-[15px] w-[15px] rounded-full`}
              style={{
                backgroundColor: `rgb(${c.color.split(",")[0]}, ${
                  c.color.split(",")[1]
                }, ${c.color.split(",")[2]})`,
              }}></div>
            <p className="text-[14px] font-thin">{c.label}</p>
          </div>
        ))}
      </div>
      <Line
        className="max-w-full transition-transform duration-[0.35s] hover:scale-[1.01]"
        data={chartData}
        options={
          labelType === "percent"
            ? (chartOptions("line", "percent") as any)
            : (chartOptions("line") as any)
        }
      />
    </div>
  );
}
