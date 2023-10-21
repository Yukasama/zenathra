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
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { cn, computeDomain } from "@/lib/utils";
import Skeleton from "./ui/skeleton";
import { trpc } from "@/app/_trpc/client";

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

  const [domain, setDomain] = useState([0, 0]);
  const [startPrice, setStartPrice] = useState<number>(0);
  const [transformedData, setTransformedData] = useState<any[]>([]);

  useEffect(() => setMounted(true), []);

  const { data: results, isFetched } = trpc.stock.history.useQuery(symbols);

  // results[timeFrame] is undefined when the query is not yet fetched
  useEffect(() => {
    if (isFetched && results) {
      setDomain(computeDomain(results[timeFrame]));
      setStartPrice(Number(results[timeFrame][0].close));
      setTransformedData(
        results[timeFrame].map((item: any) => {
          const uv = Number(item.close);
          return {
            name: item.date,
            uvAbove: uv >= startPrice ? uv : null,
            uvBelow: uv < startPrice ? uv : null,
          };
        })
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetched]);

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
            ${payload[0].value.toFixed(2)} (
            <span className="text-[12px]">
              {(payload[0].value / Number(results[timeFrame][0].close)) * 100 -
                100 >
                0 && "+"}
              {(
                (payload[0].value / Number(results[timeFrame][0].close)) * 100 -
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
      style={{ height: (height || 250) + 100 }}>
      <CardHeader>
        <div className="flex justify-between gap-3">
          <div className="flex items-center gap-2">
            {image ? <Skeleton isLoaded={isFetched}>{image}</Skeleton> : null}
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

          <Tabs defaultValue="1D">
            <TabsList className={`${!isFetched && "bg-transparent gap-[1px]"}`}>
              {timeFrames.map((timeFrame) => (
                <Skeleton key={timeFrame} isLoaded={isFetched}>
                  <TabsTrigger
                    onClick={() => setTimeFrame(timeFrame)}
                    value={timeFrame}>
                    {timeFrame}
                  </TabsTrigger>
                </Skeleton>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton isLoaded={mounted && isFetched}>
          <ResponsiveContainer width="100%" height={height || 250}>
            <AreaChart
              className="bg-card"
              width={width ?? 500}
              height={height ?? 250}
              data={transformedData}
              margin={{ top: 5, right: 40, left: 0, bottom: 5 }}>
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
              <YAxis
                domain={domain}
                fontSize={12}
                tickFormatter={(value) => `${value.toFixed(2)}`}
              />
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
      </CardContent>
    </Card>
  );
}
