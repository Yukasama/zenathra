"use client";

import { trpc } from "@/trpc/client";
import { Quote } from "@/types/stock";
import { useState, useEffect } from "react";
import { LineChart, Line, YAxis } from "recharts";
import { Spinner } from "@nextui-org/react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  quote: Quote;
}

export default function SmallChart({ quote }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const { data, isFetched } = trpc.stock.history.useQuery({
    symbol: quote.symbol,
    timeframe: "1D",
  });

  return (
    <div className="w-[200px] h-[50px]">
      {mounted && isFetched ? (
        <LineChart data={data}>
          <YAxis domain={["dataMin", "dataMax"]} hide={true} />
          <Line
            type="monotone"
            dataKey="close"
            stroke={quote.changesPercentage >= 0 ? "#19E363" : "#e6221e"}
            strokeWidth={2.1}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      ) : (
        <Spinner size="sm" />
      )}
    </div>
  );
}
