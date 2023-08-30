"use client";

import { ChartProps } from "@/types/stock";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "./ui/card";

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
        <p className="text-sm text-[#8884d8]">{payload[0].value}</p>
        <p className="text-sm text-[#82ca9d]">{payload[1].value}</p>
      </Card>
    );
  }

  return null;
};

export default function ChartArea({ data, size = "md" }: ChartProps) {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {mounted ? (
        <AreaChart
          width={size === "sm" ? 450 : size === "md" ? 600 : 800}
          height={size === "sm" ? 225 : size === "md" ? 300 : 400}
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" fontSize={12} />
          <YAxis fontSize={12} />
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          {/* @ts-ignore */}
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="uv"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorUv)"
          />
          <Area
            type="monotone"
            dataKey="pv"
            stroke="#82ca9d"
            fillOpacity={1}
            fill="url(#colorPv)"
          />
        </AreaChart>
      ) : (
        <div
          className={`${
            size === "sm"
              ? "w-[450px] h-[225px]"
              : size === "md"
              ? "w-[600px] h-[300px]"
              : "w-[800px] h-[400px]"
          } animate-pulse-right`}></div>
      )}
    </>
  );
}
