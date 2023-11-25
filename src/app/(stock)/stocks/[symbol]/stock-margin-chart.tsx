"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import Skeleton from "../../../../components/ui/skeleton";
import { cn } from "@/lib/utils";

const CustomTooltip = ({ active, payload, label }: { active: any; payload: any; label: any }) => {
  if (active && payload && payload.length) {
    return (
      <Card className="p-2">
        <p className="text-[15px]">{label}</p>
        <p className="text-sm text-[#19E363]">{(payload[0].value * 100).toFixed(2)}%</p>
        <p className="text-sm text-[#2891e0]">{(payload[1].value * 100).toFixed(2)}%</p>
        <p className="text-sm text-[#893ade]">{(payload[2].value * 100).toFixed(2)}%</p>
      </Card>
    );
  }
  return null;
};

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  data: any;
  companyName: string;
}

export default function StockMarginChart({ data, companyName, className }: Props) {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => setMounted(true), []);

  return (
    <Card
      className={cn(className, "w-full max-w-[600px] bg-zinc-50 dark:bg-zinc-900/70 border-none")}
      style={{
        height: 350,
      }}
    >
      <CardHeader>
        <CardTitle>Margins</CardTitle>
        <CardDescription>Margin Data for {companyName}</CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton isLoaded={mounted}>
          {mounted && (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                width={500}
                height={250}
                data={data}
                margin={{
                  top: 5,
                  right: 40,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={(value) => `${(value * 100).toFixed(1)}%`} />
                {/* @ts-ignore */}
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="pv" fill="#27cc53" name="Gross M." />
                <Bar dataKey="uv" fill="#2891e0" name="Operating M." />
                <Bar dataKey="fv" fill="#893ade" name="Profit M." />
                <Legend height={32} margin={{ left: 20 }} wrapperStyle={{ fontSize: "14px" }} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Skeleton>
      </CardContent>
    </Card>
  );
}
