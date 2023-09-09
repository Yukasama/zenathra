"use client";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  ResponsiveContainer,
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
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { cn, computeDomain } from "@/lib/utils";
import { Skeleton } from "@nextui-org/skeleton";
import { Stock } from "@prisma/client";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  stocks: Stock[];
}

export default function StockPriceChart({ stocks, className }: Props) {
  const [mounted, setMounted] = useState<boolean>(false);
  const [timeFrame, setTimeFrame] = useState<string>("1D");

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: results, isFetched } = useQuery({
    queryFn: async () => {
      const payload: StockHistoryProps = {
        symbol: stocks.map((s) => s.symbol),
        range: "Everything",
      };

      const { data } = await axios.post("/api/stock/history", payload);

      const newData: any = {};
      for (const key in data) {
        newData[key] = data[key].map((item: any) => ({
          name:
            key === "1D" ? item.date.split(" ")[1] : item.date.split(" ")[0],
          uv: item.close.toFixed(2),
        }));
      }
      return newData;
    },
    queryKey: ["portfolio-history-query"],
  });

  let [minDomain, maxDomain] = [0, 0];
  let pos = true;

  if (isFetched) {
    pos =
      Number(results[timeFrame][0].uv) <
      Number(results[timeFrame][results[timeFrame].length - 1].uv);
    [minDomain, maxDomain] = computeDomain(results[timeFrame]);
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
          <p
            className="text-sm text-[#19E363]"
            style={{ color: pos ? "#19E363" : "#e6221e" }}>
            ${payload[0].value} (
            <span className="text-[12px]">
              {(payload[0].value / Number(results[timeFrame][0].uv)) * 100 -
                100 >
                0 && "+"}
              {(
                (payload[0].value / Number(results[timeFrame][0].uv)) * 100 -
                100
              ).toFixed(2)}
              %)
            </span>
          </p>
        </Card>
      );
    }
    return null;
  };

  const timeFrames = ["1D", "5D", "1M", "6M", "1Y", "ALL"];

  return (
    <Card className={cn(className, "w-full max-w-[600px] h-[400px]")}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="f-col gap-1">
            <Skeleton isLoaded={isFetched} className="rounded-md">
              <CardTitle className="bg-card hidden md:flex">
                Portfolio Chart
              </CardTitle>
            </Skeleton>
            <Skeleton isLoaded={isFetched} className="rounded-md">
              <CardDescription className="bg-card hidden md:flex">
                Chart of all portfolio positions summed up
              </CardDescription>
            </Skeleton>
          </div>
          <Skeleton isLoaded={isFetched} className="rounded-md">
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
          </Skeleton>
        </div>
      </CardHeader>
      <div className="">
        <Skeleton isLoaded={isFetched} className="rounded-md">
          <ResponsiveContainer width="100%" height={300}>
            {mounted ? (
              <AreaChart
                className="bg-card"
                width={600}
                height={300}
                data={results && results[timeFrame]}
                margin={{
                  top: 5,
                  right: 60,
                  left: 20,
                  bottom: 5,
                }}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={pos ? "#19E363" : "#e6221e"}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={pos ? "#19E363" : "#e6221e"}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" fontSize={12} />
                <YAxis domain={[minDomain, maxDomain]} fontSize={12} />
                {/* @ts-ignore */}
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="uv"
                  stroke={pos ? "#19E363" : "#e6221e"}
                  fillOpacity={1}
                  fill="url(#colorUv)"
                  name="Price"
                  animationDuration={500}
                />
              </AreaChart>
            ) : (
              <div className="h-[300px] w-[540px] animate-pulse-right ml-10 mb-10"></div>
            )}
          </ResponsiveContainer>
        </Skeleton>
      </div>
    </Card>
  );
}
