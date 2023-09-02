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
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
} from "./ui/card";

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
        <p className="text-sm text-[#82ca9d]">
          {payload[1] && payload[1].value}
        </p>
      </Card>
    );
  }
  return null;
};

export default function ChartArea({
  title,
  description,
  data,
  height = 300,
  width = 500,
}: ChartProps) {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {mounted ? (
          <AreaChart
            width={width}
            height={height}
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
              {data.map((d) => d.pv).some((d) => d !== 0) && (
                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
              )}
            </defs>
            <XAxis dataKey="name" fontSize={12} />
            <YAxis fontSize={12} />
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            {/* @ts-ignore */}
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="uv"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorUv)"
            />
            {data.map((d) => d.pv).some((d) => d !== 0) && (
              <Area
                type="monotone"
                dataKey="pv"
                stroke="#82ca9d"
                fillOpacity={1}
                fill="url(#colorPv)"
              />
            )}
            {data.map((d) => d.fv).some((d) => d !== 0) && (
              <Area
                type="monotone"
                dataKey="fv"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorFv)"
              />
            )}
          </AreaChart>
        ) : (
          <p>Loading...</p>
        )}
      </CardContent>
    </Card>
  );
}
