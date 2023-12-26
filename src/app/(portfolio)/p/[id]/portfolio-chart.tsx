"use client";

import {
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCallback, useEffect, useState } from "react";
import { Button, Tabs, Tab } from "@nextui-org/react";
import { cn, computeDomain } from "@/lib/utils";
import Skeleton from "@/components/ui/skeleton";
import { trpc } from "@/trpc/client";
import { Portfolio } from "@prisma/client";
import { RotateCcw } from "lucide-react";
import debounce from "lodash.debounce";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  portfolio: Pick<Portfolio, "id" | "createdAt">;
  title?: string;
  description?: string;
  image?: React.ReactNode;
  height?: number;
  width?: number;
}

export default function PriceChart({
  title,
  description,
  portfolio,
  image,
  height,
  width,
  className,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [timeFrame, setTimeFrame] = useState<any>("1D");
  const [domain, setDomain] = useState([0, 0]);
  const [startPrice, setStartPrice] = useState(0);
  const [results, setResults] = useState([]);
  const [positive, setPositive] = useState(true);

  const request = debounce(async () => refetch(), 3000);
  const debounceRequest = useCallback(() => {
    request();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data, refetch, isFetched } = trpc.portfolio.history.useQuery({
    portfolioId: portfolio.id,
    timeframe: timeFrame,
  });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isFetched && data && data[timeFrame].length) {
      setDomain(computeDomain(data[timeFrame]));
      setStartPrice(Number(data[timeFrame][0].close));
      setPositive(
        Number(data[timeFrame][data[timeFrame].length - 1].close) >=
          Number(data[timeFrame][0].close)
      );
      setResults(
        data[timeFrame].map((item: any) => {
          return {
            name: item.date,
            uv: item.close,
          };
        })
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetched, timeFrame]);

  const CustomTooltip: any = ({
    active,
    payload,
    label,
  }: {
    active: any;
    payload: any;
    label: any;
  }) => {
    if (active && payload && payload.length && data) {
      return (
        <Card className="p-2 bg-item">
          <p className="text-[15px]">{label}</p>
          <p
            className={`text-sm ${
              positive ? "text-[#19E363]" : "text-[#e6221e]"
            }`}>
            ${payload[0].value.toFixed(2)} (
            <span className="text-[12px]">
              {(payload[0].value / Number(data[timeFrame][0].close)) * 100 -
                100 >
                0 && "+"}
              {(
                (payload[0].value / Number(data[timeFrame][0].close)) * 100 -
                100
              ).toFixed(2)}
              %)
            </span>
          </p>
        </Card>
      );
    }
    return null;
  };

  // Setting history availability
  const portfolioCreated = new Date(portfolio.createdAt).getTime();
  const today = new Date().getTime();
  const diff = today - portfolioCreated;
  const existsSince = diff / (1000 * 60 * 60 * 24);

  const timeFrames: any = {
    "1D": true,
    "5D": existsSince > 2,
    "1M": existsSince > 6,
    "6M": existsSince > 31,
    "1Y": existsSince > 150,
    "5Y": existsSince > 1500,
    All: existsSince > 31,
  };

  return (
    <Card
      className={cn(className, "w-full md:max-w-[650px]")}
      style={{ height: (height || 250) + 100 }}>
      <CardHeader>
        <div className="flex justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Image */}
            {image ? <Skeleton isLoaded={isFetched}>{image}</Skeleton> : null}

            {/* Title */}
            <div className="f-col gap-1">
              <Skeleton isLoaded={isFetched}>
                <CardTitle className="hidden md:flex">{title}</CardTitle>
              </Skeleton>
              <Skeleton isLoaded={isFetched}>
                <CardDescription className="hidden md:flex max-w-[175px] truncate">
                  {description}
                </CardDescription>
              </Skeleton>
            </div>
          </div>

          {/* History Selector */}
          <Skeleton isLoaded={isFetched}>
            <Tabs
              aria-label="History Selector"
              selectedKey={timeFrame}
              disabledKeys={Object.keys(timeFrames).filter(
                (key: any) => !timeFrames[key]
              )}
              onSelectionChange={setTimeFrame}>
              {Object.keys(timeFrames).map((timeFrame) => (
                <Tab key={timeFrame} aria-label={timeFrame} title={timeFrame} />
              ))}
            </Tabs>
          </Skeleton>
        </div>
      </CardHeader>

      {/* Chart */}
      <CardContent>
        <Skeleton isLoaded={mounted && isFetched}>
          {isFetched && !data[timeFrame].length ? (
            <div className="f-box f-col gap-1 mt-16">
              <p className="text-zinc-500">Chart could not be loaded</p>
              <Button
                isIconOnly
                onClick={() => debounceRequest()}
                aria-label="Reload chart">
                <RotateCcw size={18} />
              </Button>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={height || 250}>
              <AreaChart
                width={width ?? 550}
                height={height ?? 250}
                data={results}
                margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={positive ? "#19E363" : "#e6221e"}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={positive ? "#19E363" : "#e6221e"}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" fontSize={12} />
                <YAxis
                  domain={domain}
                  fontSize={12}
                  tickFormatter={(value) => `${value.toFixed(2)}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine
                  y={startPrice}
                  strokeDasharray="3 3"
                  stroke="gray"
                />
                <Area
                  type="monotone"
                  dataKey="uv"
                  stroke={positive ? "#19E363" : "#e6221e"}
                  fillOpacity={1}
                  fill="url(#colorUv)"
                  animationDuration={500}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Skeleton>
      </CardContent>
    </Card>
  );
}
