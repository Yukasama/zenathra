"use client";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import Skeleton from "../../../../components/ui/skeleton";
import { cn } from "@/lib/utils";

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
        <p className="text-sm text-[#19E363]">{payload[0].value.toFixed(3)}</p>
        <p className="text-sm text-[#2891e0]">{payload[1].value.toFixed(3)}</p>
        <p className="text-sm text-[#893ade]">{payload[2].value.toFixed(3)}</p>
      </Card>
    );
  }
  return null;
};

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  data: any;
  companyName: string;
}

export default function StockKeyMetricsChart({
  data,
  companyName,
  className,
}: Props) {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => setMounted(true), []);

  return (
    <Card
      className={cn(className, "w-full max-w-[600px]")}
      style={{
        height: 350,
      }}>
      <CardHeader>
        <CardTitle>Key Ratios</CardTitle>
        <CardDescription>Important Metrics for {companyName}</CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton isLoaded={mounted}>
          {mounted && (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart
                width={500}
                height={250}
                data={data}
                className="bg-card"
                margin={{
                  top: 5,
                  right: 40,
                  left: 20,
                  bottom: 5,
                }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                {/* @ts-ignore */}
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="pv"
                  stroke="#19E363"
                  name="P/E Ratio"
                />
                <Line
                  type="monotone"
                  dataKey="uv"
                  stroke="#2891e0"
                  name="EPS"
                />
                <Line
                  type="monotone"
                  dataKey="fv"
                  stroke="#893ade"
                  name="P/B Ratio"
                  dot
                />
                <Legend
                  height={32}
                  margin={{ left: 20 }}
                  wrapperStyle={{ fontSize: "14px" }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Skeleton>
      </CardContent>
    </Card>
  );
}
