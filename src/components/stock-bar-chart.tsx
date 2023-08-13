"use client";

import {
  Chart as Chartjs,
  LinearScale,
  Filler,
  CategoryScale,
  PointElement,
  BarElement,
  ScriptableContext,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { chartOptions } from "@/config/chart-options";
import { StockChartProps } from "@/types/stock";
import { StockChart } from "@/components";

Chartjs.register(
  LinearScale,
  CategoryScale,
  Filler,
  PointElement,
  BarElement,
  Tooltip,
  Legend
);

export default function StockBarChart({
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
      backgroundColor: (context: ScriptableContext<"bar">) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 260);
        gradient.addColorStop(0, `rgba(${c.color}, 0.5)`);
        gradient.addColorStop(1, `rgba(${c.color}, 0.2)`);
        return gradient;
      },
      borderColor: `rgb(${c.color})`,
      borderWidth: 3,
      fill: c.fill,
    })),
  };

  return (
    <StockChart title={title} size={size} data={data} labels={labels}>
      <Bar
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
            ? (chartOptions("bar", "percent") as any)
            : (chartOptions("bar") as any)
        }
      />
    </StockChart>
  );
}
