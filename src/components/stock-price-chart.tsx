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
import { History } from "@/types/stock";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { cn } from "@/lib/utils";
import { StockImage } from "./stock-image";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  symbol: string;
  image?: string;
  showImage?: boolean;
  height?: number;
  width?: number;
  showTimeFrames?: boolean;
}

export default function StockPriceChart({
  title,
  description,
  symbol,
  image,
  showImage = false,
  height = 300,
  width = 600,
  showTimeFrames = false,
  className,
}: Props) {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    isFetching,
    data: results,
    refetch,
    isFetched,
  } = useQuery({
    queryFn: async () => {
      const payload: StockHistoryProps = {
        symbol,
        range: "1D",
      };

      const { data } = await axios.post("/api/stock/history", payload);

      return data.map((d: History) => {
        return {
          name: d.date,
          uv: d.close,
        };
      });
    },
    queryKey: ["history-query"],
  });

  let pos = true;
  if (isFetched) pos = results[results.length - 1].uv > results[0].uv;

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
            ${payload[0].value}
          </p>
        </Card>
      );
    }
    return null;
  };

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            {showImage && <StockImage src={image} px={45} />}
            <div className="space-y-1.5">
              <CardTitle>{title}</CardTitle>
              <CardDescription className="truncate w-[280px]">
                {description}
              </CardDescription>
            </div>
          </div>
          {showTimeFrames && (
            <Tabs defaultValue="1D">
              <TabsList>
                <TabsTrigger value="1m">1m</TabsTrigger>
                <TabsTrigger value="30m">30m</TabsTrigger>
                <TabsTrigger value="1h">1h</TabsTrigger>
                <TabsTrigger value="4h">4h</TabsTrigger>
                <TabsTrigger value="1D">1D</TabsTrigger>
                <TabsTrigger value="1M">1M</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>
      </CardHeader>
      <div className="pr-10 pb-3">
        {mounted ? (
          <AreaChart
            width={width}
            height={height}
            data={results}
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
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="name" fontSize={12} />
            <YAxis fontSize={12} />
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
            />
          </AreaChart>
        ) : (
          <div
            className="animate-pulse-right ml-10 mb-10"
            style={{ width: width - 60, height: height - 20 }}></div>
        )}
      </div>
    </Card>
  );
}
