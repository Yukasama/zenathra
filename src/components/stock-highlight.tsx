import StockPrice from "./stock-price";
import { getQuote } from "@/lib/fmp/quote";
import { db } from "@/lib/db";
import { StockImage } from "./shared/stock-image";
import axios from "axios";
import { StockHistoryProps } from "@/lib/validators/stock";
import { StructureProps } from "@/types/layout";
import { cn } from "@/lib/utils";
import ChartArea from "./chart-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  symbol: string | null;
}

function Structure({ className, isLoading, children }: StructureProps) {
  return (
    <div
      className={cn(
        `${isLoading && "animate-pulse-right"} flex flex-1 min-h-[450px]`,
        className
      )}>
      {children}
    </div>
  );
}

export function StockHighlightLoading({ className }: StructureProps) {
  return <Structure isLoading className={className} />;
}

export default async function StockHighlight({ symbol, className }: Props) {
  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  if (!symbol)
    return (
      <Structure className={className}>
        <p className="text-lg">Highlight could not be loaded.</p>
      </Structure>
    );

  const payload: StockHistoryProps = {
    symbol,
    range: "1D",
  };

  const [quote, image] = await Promise.all([
    getQuote(symbol),
    db.stock.findFirst({
      select: { image: true },
      where: { symbol: symbol },
    }),
    // axios.post("/api/stock/history", payload),
  ]);

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <div className="flex justify-between">
          <div className="flex gap-3">
            <StockImage src={image?.image} px={40} priority />
            <div className="f-col gap-1">
              <CardTitle>{symbol}</CardTitle>
              <CardDescription>{quote?.name}</CardDescription>
            </div>
          </div>
          <StockPrice quote={quote} />
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <ChartArea data={data} size="sm" />
      </CardContent>
    </Card>
  );
}
