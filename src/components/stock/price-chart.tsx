"use client";

import {
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { cn } from "@/lib/utils";
import Skeleton from "../ui/skeleton";
import { trpc } from "@/app/_trpc/client";

function computeDomain(data: any[]) {
  const values = data.map((item) => parseFloat(item.uv));
  const dataMax = Math.max(...values);
  const dataMin = Math.min(...values);
  const padding = (dataMax - dataMin) * 0.05; // 5% padding

  return [
    Number((dataMin - padding).toFixed(2)),
    Number((dataMax + padding).toFixed(2)),
  ];
}

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  symbols: string | string[];
  image?: React.ReactNode;
  height?: number;
  width?: number;
}

export default function PriceChart({
  title,
  description,
  symbols,
  image,
  height,
  width,
  className,
}: Props) {
  const [mounted, setMounted] = useState<boolean>(false);
  const [timeFrame, setTimeFrame] = useState<string>("1D");

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: results, isFetched } = trpc.stock.history.useQuery({
    symbol: symbols,
  });

  let [minDomain, maxDomain] = [0, 0];
  let startPrice = 0;
  let transformedData: any[] = [];

  if (isFetched) {
    [minDomain, maxDomain] = computeDomain(results[timeFrame]);
    startPrice = Number(results[timeFrame][0].uv);
    transformedData = results[timeFrame].map((item: any) => {
      const uv = Number(item.uv);
      return {
        name: item.name,
        uvAbove: uv >= startPrice ? uv : null,
        uvBelow: uv < startPrice ? uv : null,
      };
    });
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
            style={{
              color: payload[0].value >= startPrice ? "#19E363" : "#e6221e",
            }}>
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

  const timeFrames = ["1D", "5D", "1M", "6M", "1Y", "5Y", "ALL"];

  return (
    <Card
      className={cn(className, "w-full md:max-w-[600px]")}
      style={{
        height: (height || 250) + 100,
      }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton isLoaded={isFetched}>{image ?? null}</Skeleton>
            <div className="f-col gap-1">
              <Skeleton isLoaded={isFetched}>
                <CardTitle className="bg-card hidden md:flex">
                  {title}
                </CardTitle>
              </Skeleton>
              <Skeleton isLoaded={isFetched}>
                <CardDescription className="bg-card hidden md:flex max-w-[175px] truncate">
                  {description}
                </CardDescription>
              </Skeleton>
            </div>
          </div>
          <Skeleton isLoaded={isFetched}>
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
      {mounted && (
        <Skeleton isLoaded={isFetched}>
          <ResponsiveContainer width="100%" height={height || 250}>
            <AreaChart
              className="bg-card"
              width={width || 500}
              height={height || 250}
              data={transformedData}
              margin={{ top: 5, right: 60, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorUvAbove" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#19E363" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#19E363" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorUvBelow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e6221e" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#e6221e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" fontSize={12} />
              <YAxis domain={[minDomain, maxDomain]} fontSize={12} />
              {/* @ts-ignore */}
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={startPrice}
                strokeDasharray="3 3"
                stroke="gray"
              />
              <Area
                type="monotone"
                dataKey="uvAbove"
                stroke="#19E363"
                fillOpacity={1}
                fill="url(#colorUvAbove)"
                animationDuration={500}
              />
              <Area
                type="linear"
                dataKey="uvBelow"
                stroke="#e6221e"
                fillOpacity={1}
                fill="url(#colorUvBelow)"
                animationDuration={500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Skeleton>
      )}
    </Card>
  );
}
