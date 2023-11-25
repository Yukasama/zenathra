"use client";

import { XAxis, YAxis, Tooltip, AreaChart, Area, ResponsiveContainer, ReferenceLine } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { cn, computeDomain } from "@/lib/utils";
import Skeleton from "../ui/skeleton";
import { trpc } from "@/trpc/client";
import { Tabs, Tab } from "@nextui-org/tabs";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  symbol: string;
  title?: string;
  description?: string;
  image?: React.ReactNode;
  height?: number;
  width?: number;
}

export default function PriceChart({ title, description, symbol, image, height, width, className }: Props) {
  const [mounted, setMounted] = useState(false);
  const [timeFrame, setTimeFrame] = useState<any>("1D");
  const [domain, setDomain] = useState([0, 0]);
  const [startPrice, setStartPrice] = useState(0);
  const [results, setResults] = useState([]);
  const [positive, setPositive] = useState(true);

  const { data, isFetched } = trpc.stock.history.useQuery({ symbol });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isFetched && data) {
      setDomain(computeDomain(data[timeFrame]));
      setStartPrice(Number(data[timeFrame][0].close));
      setPositive(Number(data[timeFrame][data[timeFrame].length - 1].close) >= Number(data[timeFrame][0].close));
      setResults(
        data[timeFrame].map((item: any) => {
          return {
            name: item.date,
            uv: item.close,
          };
        })
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetched, timeFrame]);

  const CustomTooltip = ({ active, payload, label }: { active: any; payload: any; label: any }) => {
    if (active && payload && payload.length && data) {
      return (
        <Card className="p-2">
          <p className="text-[15px]">{label}</p>
          <p className={`text-sm ${positive ? "text-[#19E363]" : "text-[#e6221e]"}`}>
            ${payload[0].value.toFixed(2)} (
            <span className="text-[12px]">
              {(payload[0].value / Number(data[timeFrame][0].close)) * 100 - 100 > 0 && "+"}
              {((payload[0].value / Number(data[timeFrame][0].close)) * 100 - 100).toFixed(2)}
              %)
            </span>
          </p>
        </Card>
      );
    }
    return null;
  };

  const timeFrames = ["1D", "5D", "1M", "6M", "1Y", "5Y", "All"];

  return (
    <Card
      className={cn(className, "w-full md:max-w-[600px] bg-zinc-50 dark:bg-zinc-900/70 border-none")}
      style={{ height: (height || 250) + 100 }}
    >
      <CardHeader>
        <div className="flex justify-between gap-3">
          <div className="flex items-center gap-2">
            {image ? <Skeleton isLoaded={isFetched}>{image}</Skeleton> : null}
            <div className="f-col gap-1">
              <Skeleton isLoaded={isFetched}>
                <CardTitle className="hidden md:flex">{title}</CardTitle>
              </Skeleton>
              <Skeleton isLoaded={isFetched}>
                <CardDescription className="hidden md:flex max-w-[175px] truncate">{description}</CardDescription>
              </Skeleton>
            </div>
          </div>

          <Skeleton isLoaded={isFetched}>
            <Tabs selectedKey={timeFrame} onSelectionChange={setTimeFrame}>
              {timeFrames.map((timeFrame) => (
                <Tab key={timeFrame} title={timeFrame} />
              ))}
            </Tabs>
          </Skeleton>
        </div>
      </CardHeader>

      <CardContent>
        <Skeleton isLoaded={mounted && isFetched}>
          <ResponsiveContainer width="100%" height={height || 250}>
            <AreaChart
              className="bg-transparent"
              width={width ?? 500}
              height={height ?? 250}
              data={results}
              margin={{ top: 5, right: 40, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={positive ? "#19E363" : "#e6221e"} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={positive ? "#19E363" : "#e6221e"} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" fontSize={12} />
              <YAxis domain={domain} fontSize={12} tickFormatter={(value) => `${value.toFixed(2)}`} />
              {/* @ts-ignore */}
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={startPrice} strokeDasharray="3 3" stroke="gray" />
              <Area
                type="monotone"
                dataKey="uv"
                stroke={positive ? "#19E363" : "#e6221e"}
                fillOpacity={1}
                fill="url(#colorUv)"
                animationDuration={500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Skeleton>
      </CardContent>
    </Card>
  );
}
