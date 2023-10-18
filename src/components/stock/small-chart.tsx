"use client";

import { trpc } from "@/app/_trpc/client";
import { computeDomain } from "@/lib/utils";
import { Quote } from "@/types/stock";
import { useState, useEffect } from "react";
import { Area, AreaChart, YAxis } from "recharts";
import Skeleton from "../ui/skeleton";

interface Props {
  quote: Quote;
}

export default function SmallChart({ quote }: Props) {
  const [mounted, setMounted] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [domain, setDomain] = useState([0, 0]);

  useEffect(() => setMounted(true), []);

  const { data: results, isFetched } = trpc.stock.dailyHistory.useQuery(
    quote.symbol
  );

  useEffect(() => {
    if (isFetched && results) {
      const data = results.map((result) => ({
        name: result.date,
        uv: result.close,
      }));
      setData(data);
      setDomain(computeDomain(data));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetched]);

  return (
    <Skeleton isLoaded={mounted && isFetched}>
      <AreaChart width={95} height={60} data={data}>
        <defs>
          <linearGradient id="uv" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor={quote.changesPercentage > 0 ? "#19E363" : "#e6221e"}
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor={quote.changesPercentage > 0 ? "#19E363" : "#e6221e"}
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <YAxis domain={domain} hide={true} />
        <Area
          type="monotone"
          dataKey="uv"
          fill="url(#uv)"
          stroke={quote.changesPercentage > 0 ? "#19E363" : "#e6221e"}
        />
      </AreaChart>
    </Skeleton>
  );
}
