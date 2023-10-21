"use client";

import { useEffect, useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Stock } from "@prisma/client";
import Skeleton from "../ui/skeleton";

const BASE_COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#ED261F",
  "#A463F2",
  "#FF6F91",
  "#FFD700",
  "#20B2AA",
  "#7C4DFF",
];

function generateColors(num: number): string[] {
  let colors: string[] = [];
  while (colors.length < num) colors = colors.concat(BASE_COLORS);
  return colors.slice(0, num);
}

const getPercentage = (count: number, total: number): string =>
  `${((count / total) * 100).toFixed(2)}%`;

interface Props {
  stocks: Pick<Stock, "sector">[];
}

export default function PortfolioAllocation({ stocks }: Props) {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => setMounted(true), []);

  const sectorCount = useMemo(() => {
    const count: { [key: string]: number } = {};
    stocks.forEach((stock) => {
      if (stock.sector) {
        if (count[stock.sector]) count[stock.sector] += 1;
        else count[stock.sector] = 1;
      }
    });
    return count;
  }, [stocks]);

  const sortedData = useMemo(() => {
    const unsorted = Object.entries(sectorCount).map(([name, value]) => ({
      name,
      value,
    }));
    return unsorted.sort((a, b) => b.value - a.value);
  }, [sectorCount]);

  const colors = useMemo(() => generateColors(sortedData.length), [sortedData]);

  const renderCustomLabel = ({ value }: { value: number }) => {
    const percentage = getPercentage(value, stocks.length);
    return `${percentage}`;
  };

  return (
    <Card className="w-full max-w-[500px] h-[370px] sm:h-[350px] shadow-lg">
      <CardHeader>
        <CardTitle>Portfolio Allocation</CardTitle>
        <CardDescription>Sector allocation of your portfolio</CardDescription>
      </CardHeader>

      <Skeleton isLoaded={mounted}>
        {mounted && (
          <div className="relative w-full">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart margin={{ top: -20, bottom: 30 }}>
                <Pie
                  data={sortedData}
                  startAngle={180}
                  endAngle={-180}
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                  fontSize={14}
                  label={renderCustomLabel}>
                  {sortedData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index]}
                      stroke={colors[index]}
                      strokeWidth={0.6}
                      onMouseEnter={() => {}}
                    />
                  ))}
                </Pie>
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    border: "none",
                    borderRadius: "5px",
                  }}
                  wrapperStyle={{ zIndex: 100 }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "14px" }}
                  verticalAlign="bottom"
                  height={1}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </Skeleton>
    </Card>
  );
}
