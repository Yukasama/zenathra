"use client";

import { trpc } from "@/trpc/client";
import { cn } from "@/lib/utils";
import { History, Quote } from "@/types/stock";
import { useState, useEffect } from "react";
import { LineChart, Line, YAxis } from "recharts";
import { Spinner } from "@nextui-org/react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  quote: Quote;
  height?: number;
}

export default function SmallChart({ quote, height, className }: Props) {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => setMounted(true), []);

  const { data: results, isFetched } = trpc.stock.history.useQuery({
    symbol: quote.symbol,
    daily: true,
  });

  useEffect(() => {
    if (isFetched && results) {
      const data = results.map((result: History) => ({
        name: result.date,
        uv: result.close,
      }));
      setData(data.slice(0, 420).reverse());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetched]);

  return (
    <>
      {mounted && isFetched ? (
        <LineChart
          data={data}
          width={200}
          height={height ?? 70}
          className={cn(className)}>
          <YAxis domain={["dataMin", "dataMax"]} hide={true} />
          <Line
            type="monotone"
            dataKey="uv"
            stroke={quote.changesPercentage > 0 ? "#19E363" : "#e6221e"}
            strokeWidth={2.1}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      ) : (
        <Spinner size="sm" />
      )}
    </>
  );
}
