"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";
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
  while (colors.length < num) {
    colors = colors.concat(BASE_COLORS);
  }
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

  const renderCustomLabel = (entry: any) => {
    return entry.name; // Return the name property of the data entry
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Allocation</CardTitle>
        <CardDescription>Sector allocation of your portfolio</CardDescription>
      </CardHeader>
      {mounted && (
        <PieChart
          width={600}
          height={310}
          margin={{ top: 10, right: 0, bottom: 50, left: 0 }}>
          <Pie
            data={data}
            innerRadius={75}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            label={renderCustomLabel}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Pie>
        </PieChart>
      )}
    </Card>
  );
}
