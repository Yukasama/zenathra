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

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
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

export default function StockPriceChart({
  title,
  description,
  symbols,
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
        symbol: symbols,
        range: "Everything",
      };

      const { data } = await axios.post("/api/stock/history", payload);

      return data.map((d: History) => {
        return {
          name: d.date,
          uv: d.close,
        };
      });
    },
    queryKey: ["portfolio-history-query"],
  });

  let pos = null;
  if (isFetched) pos = results[results.length - 1].uv > results[0].uv;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
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
        </div>
      </CardHeader>
      <div className="pr-10 pb-3">
        {mounted ? (
          <AreaChart
            width={600}
            height={300}
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
            <YAxis fontSize={12} />
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
  );
}
