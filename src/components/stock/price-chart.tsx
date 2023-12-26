"use client";

import {
  XAxis,
  YAxis,
  Tooltip,
  Area,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
  CartesianGrid,
} from "recharts";
import { memo, useEffect, useMemo, useState } from "react";
import { cn, computeDomain } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { Tabs, Tab, Spinner, Card } from "@nextui-org/react";
import { format, parseISO } from "date-fns";
import { useTheme } from "next-themes";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  symbol: string;
}

function getFormattedDate(date: string, timeframe: string) {
  switch (timeframe) {
    case "1D":
      return format(parseISO(date), "HH:mm");
    case "5D":
      return format(parseISO(date), "dd");
    case "1M":
      return format(parseISO(date), "MMM dd");
    case "6M":
    case "1Y":
      return format(parseISO(date), "MMM");
    case "5Y":
    case "All":
      return format(parseISO(date), "yyyy");
    default:
      return format(parseISO(date), "MM/dd/yyyy");
  }
}

const PriceChart = memo(({ symbol, className }: Props) => {
  const [mounted, setMounted] = useState(false);
  const [timeFrame, setTimeFrame] = useState<any>("1D");

  const timeFrames = ["1D", "5D", "1M", "6M", "1Y", "5Y", "All"];

  const { theme } = useTheme();
  const { data, isFetched } = trpc.stock.history.useQuery({
    symbol,
    timeframe: timeFrame,
  });

  useEffect(() => setMounted(true), []);

  const chartData = useMemo(() => {
    if (isFetched && data) {
      const domain = computeDomain(data);
      const startPrice = Number(data[0].close);
      const endPrice = Number(data[data.length - 1].close);
      const positive = endPrice >= startPrice;

      const formattedData = data.map((item: any) => ({
        date: getFormattedDate(item.date, timeFrame),
        close: item.close,
      }));

      return {
        domain,
        startPrice,
        positive,
        results: formattedData,
      };
    }
    return null;
  }, [isFetched, data, timeFrame]);

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active: any;
    payload: any;
    label: any;
  }) => {
    if (active && payload && payload.length && data) {
      return (
        <Card className="p-3 f-col gap-0.5">
          <p className="text-[15px]">{label}</p>
          <div className="flex items-center text-sm gap-1.5">
            <p className="text-zinc-400">Price:</p>
            <p
              className={`font-semibold ${
                chartData?.positive ? "text-[#19E363]" : "text-[#e6221e]"
              }`}>
              ${payload[0].value.toFixed(2)} (
              <span>
                {(payload[0].value / Number(data[0].close)) * 100 - 100 > 0 &&
                  "+"}
                {(
                  (payload[0].value / Number(data[0].close)) * 100 -
                  100
                ).toFixed(2)}
                %)
              </span>
            </p>
          </div>
        </Card>
      );
    }
    return null;
  };

  return (
    <div className={cn(className, "w-full h-[280px] sm:h-[450px] f-col gap-4")}>
      <div className="flex sm:justify-end gap-3 p-1">
        <Tabs
          selectedKey={timeFrame}
          isDisabled={!mounted}
          variant="bordered"
          size="sm"
          aria-label="History Selector"
          classNames={{ tabList: "border-1" }}
          onSelectionChange={setTimeFrame}>
          {timeFrames.map((timeFrame) => (
            <Tab key={timeFrame} aria-label={timeFrame} title={timeFrame} />
          ))}
        </Tabs>
      </div>

      {!isFetched ? (
        <div className="f-col gap-1 items-center mt-24">
          <Spinner />
          Loading Data...
          <small className="text-zinc-400 text-[13px]">
            Gathering data, almost there!
          </small>
        </div>
      ) : isFetched && mounted && chartData ? (
        <ResponsiveContainer width="100%">
          <ComposedChart data={chartData.results} margin={{ right: -18 }}>
            <defs>
              <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={chartData.positive ? "#1de095" : "#e52b34"}
                  stopOpacity={0.35}
                />
                <stop
                  offset="95%"
                  stopColor={chartData.positive ? "#1de095" : "#e52b34"}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              horizontal
              stroke={theme === "dark" ? "#18181b" : "#f4f4f5"}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              fontSize={12}
              tickLine={false}
              axisLine={{ strokeWidth: 0.5 }}
              interval={Math.floor(chartData.results.length / 10)}
              tickFormatter={(tickItem, index) => (index === 0 ? "" : tickItem)}
            />
            <YAxis
              domain={chartData.domain}
              yAxisId="right"
              orientation="right"
              tickLine={false}
              interval="preserveStartEnd"
              axisLine={{ strokeWidth: 0.5 }}
              tickCount={8}
              fontSize={12}
              tickFormatter={(value, index) =>
                index === 0 ? "" : `${value.toFixed(1)}`
              }
            />
            {/* @ts-ignore */}
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={chartData.startPrice}
              yAxisId="right"
              strokeDasharray="1 4"
              stroke={theme === "dark" ? "#71717a" : "#3f3f46"}
            />
            <Area
              dataKey="close"
              stroke={chartData.positive ? "#1de095" : "#e52b34"}
              fillOpacity={1}
              yAxisId="right"
              fill="url(#colorClose)"
              isAnimationActive={false}
              strokeWidth={2}
            />
          </ComposedChart>
        </ResponsiveContainer>
      ) : (
        <p>notloae</p>
      )}
    </div>
  );
});

PriceChart.displayName = "PriceChart";

export default PriceChart;
