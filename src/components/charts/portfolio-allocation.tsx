"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Stock } from "@prisma/client";

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

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  stocks: Stock[];
}

export default function PortfolioAllocation({ stocks }: Props) {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sectorCount: { [key: string]: number } = {};
  stocks.forEach((stock) => {
    sectorCount[stock.sector] = (sectorCount[stock.sector] || 0) + 1;
  });

  const data = Object.entries(sectorCount).map(([name, value]) => ({
    name,
    value,
  }));

  const colors = generateColors(data.length);
  const renderCustomLabel = (entry: any) => entry.name;

  return (
    <Card className="w-full max-w-[600px] h-[400px]">
      <CardHeader>
        <CardTitle>Portfolio Allocation</CardTitle>
        <CardDescription>Sector allocation of your portfolio</CardDescription>
      </CardHeader>
      {mounted && (
        <div className="relative w-full">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart
              height={300}
              width={600}
              className="scale-80 sm:scale-100">
              <Pie
                data={data}
                innerRadius={65}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                fontSize={15}
                label={renderCustomLabel}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
