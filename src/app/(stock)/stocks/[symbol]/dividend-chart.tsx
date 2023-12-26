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
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Card, Spinner } from "@nextui-org/react";

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
      <Card className="p-3 f-col gap-0.5">
        <p className="text-[15px]">{label}</p>
        <div className="flex items-center text-sm gap-1.5">
          <p className="text-zinc-400">Dividend Yield:</p>
          <p className="font-semibold text-[#ff8b55]">
            {(payload[0].value * 100).toFixed(2)}%
          </p>
        </div>
      </Card>
    );
  }
  return null;
};

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  data: any[];
}

export default function DividendChart({ data, className }: Props) {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => setMounted(true), []);

  return (
    <div className={cn("w-full h-[220px] sm:h-[300px]", className)}>
      {!mounted ? (
        <div className="f-col gap-1 items-center mt-16">
          <Spinner />
          Loading Data...
          <small className="text-zinc-400 text-[13px]">
            Gathering data, almost there!
          </small>
        </div>
      ) : (
        <ResponsiveContainer width="100%">
          <LineChart data={data} margin={{ left: -22, right: 15 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme === "dark" ? "#18181b" : "#f4f4f5"}
            />
            <XAxis
              dataKey="name"
              fontSize={12}
              tickLine={false}
              axisLine={{ strokeWidth: 0.5 }}
            />
            <YAxis
              fontSize={12}
              tickLine={false}
              axisLine={{ strokeWidth: 0.5 }}
              tickFormatter={(value, i) =>
                i === 0 ? "" : `${(value * 100).toFixed(1)}%`
              }
            />
            {/* @ts-ignore */}
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="div"
              stroke="#ff8b55"
              isAnimationActive={false}
              strokeWidth={1.5}
              name="Dividend Yield"
            />
            <Legend
              height={32}
              verticalAlign="top"
              wrapperStyle={{ fontSize: "14px" }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
