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
import Skeleton from "../../../components/ui/skeleton";
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
        <p className="text-sm text-[#19E363]">
          {(payload[0].value * 100).toFixed(2)}%
        </p>
      </Card>
    );
  }
  return null;
};

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  data: any[];
  companyName: string;
}

export default function StockDividendChart({
  data,
  companyName,
  className,
}: Props) {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => setMounted(true), []);

  return (
    <Card
      className={cn(className, "w-full max-w-[600px]")}
      style={{ height: 350 }}>
      {!data.some((d) => d.uv !== 0) ? (
        <>
          <CardHeader>
            <CardTitle>Dividends</CardTitle>
            <CardDescription>Dividend Data for {companyName}</CardDescription>
          </CardHeader>
          <CardContent className="f-box">
            <p className="text-xl text-slate-400 font-medium mt-20">
              Never Payed Dividends
            </p>
          </CardContent>
        </>
      ) : (
        <>
          <CardHeader>
            <CardTitle>Dividend</CardTitle>
            <CardDescription>Dividend Data for {companyName}</CardDescription>
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
                    <YAxis
                      fontSize={12}
                      tickFormatter={(value) => `${(value * 100).toFixed(1)}%`}
                    />
                    {/* @ts-ignore */}
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="uv"
                      stroke="#19E363"
                      name="Dividend Yield"
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
        </>
      )}
    </Card>
  );
}
