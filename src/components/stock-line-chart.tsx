"use client";

import {
  Chart as Chartjs,
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
import { chartOptions } from "@/config/chart-options";
import { StockChartProps } from "@/types/stock";
import { StockChart } from "@/components";

Chartjs.register(
  LinearScale,
  CategoryScale,
  Filler,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function StockLineChart({
  title,
  labels,
  data,
  labelType,
  size = "lg",
}: StockChartProps) {
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
    <StockChart title={title} size={size} data={data} labels={labels}>
      <Line
        className={`${
          size === "lg"
            ? "h-[410px] w-[700px]"
            : size === "md"
            ? "h-[310px] w-[510px]"
            : "h-[190px] w-[270px]"
        } max-w-full transition-transform duration-[0.35s] hover:scale-[1.01]`}
        data={chartData}
        options={
          labelType === "percent"
            ? (chartOptions("line", "percent") as any)
            : (chartOptions("line") as any)
        }
      />
    </StockChart>
  );
}
