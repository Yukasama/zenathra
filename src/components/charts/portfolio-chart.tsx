"use client";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { StockHistoryProps } from "@/lib/validators/stock";
import { AllHistory, History } from "@/types/stock";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { cn } from "@/lib/utils";
import { Skeleton } from "@nextui-org/skeleton";
import { time } from "console";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  symbols: string[];
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active: any;
  payload: any;
  label: any;
}) => {
  if (active && payload && payload.length) {
    return (
      <Card className="p-2">
        <p className="text-[15px]">{label}</p>
        <p className="text-sm text-[#19E363]">${payload[0].value}</p>
      </Card>
    );
  }

  return null;
};

export default function StockPriceChart({ symbols, className }: Props) {
  const [mounted, setMounted] = useState<boolean>(false);
  const [timeFrame, setTimeFrame] = useState<string>("1D");

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: results, isFetched } = useQuery({
    queryFn: async () => {
      const payload: StockHistoryProps = {
        symbol: symbols,
        range: "Everything",
      };

      const { data } = await axios.post("/api/stock/history", payload);

      const newData: any = {};
      for (const key in data) {
        newData[key] = data[key].map((item: any) => ({
          name: item.date,
          uv: item.close.toFixed(2),
        }));
      }
      console.log(newData);
      return newData;
    },
    queryKey: ["portfolio-history-query"],
  });

  const computeDomain = (data: any[]) => {
    const values = data.map((item) => parseFloat(item.uv));
    const dataMax = Math.max(...values);
    const dataMin = Math.min(...values);
    const padding = (dataMax - dataMin) * 0.05; // 5% padding

    return [
      Number((dataMin - padding).toFixed(2)),
      Number((dataMax + padding).toFixed(2)),
    ];
  };

  let [minDomain, maxDomain] = [0, 0];
  let pos = true;
  if (isFetched) {
    pos =
      results[timeFrame][results[timeFrame].length - 1].uv >
      results[timeFrame][0].uv;
    [minDomain, maxDomain] = computeDomain(results[timeFrame]);
  }

  const timeFrames = ["1D", "5D", "1M", "6M", "1Y", "ALL"];

  return (
    <Skeleton isLoaded={isFetched}>
      <Card className={cn(className)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Portfolio Chart</CardTitle>
              <CardDescription>
                Chart of all portfolio positions summed up
              </CardDescription>
            </div>
            <Tabs defaultValue="1D">
              <TabsList>
                {timeFrames.map((timeFrame) => (
                  <TabsTrigger
                    key={timeFrame}
                    onClick={() => setTimeFrame(timeFrame)}
                    value={timeFrame}>
                    {timeFrame}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <div className="pr-10 pb-3">
          {mounted ? (
            <AreaChart
              width={600}
              height={300}
              data={results && results[timeFrame]}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}>
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={pos ? "#19E363" : "#ff0000"}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={pos ? "#19E363" : "#ff0000"}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis domain={[minDomain, maxDomain]} fontSize={12} />
              {/* @ts-ignore */}
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="uv"
                stroke={pos ? "#19E363" : "#ff0000"}
                fillOpacity={1}
                fill="url(#colorUv)"
                name="Price"
              />
            </AreaChart>
          ) : (
            <div className="h-[300px] w-[540px] animate-pulse-right ml-10 mb-10"></div>
          )}
        </div>
      </Card>
    </Skeleton>
  );
}
