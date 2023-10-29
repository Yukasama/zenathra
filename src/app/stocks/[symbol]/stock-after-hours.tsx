import type { Stock } from "@prisma/client";
import { ChevronsUp, ChevronsDown } from "lucide-react";
import { getQuote } from "@/lib/fmp/quote";
import { Card, CardDescription } from "../../../components/ui/card";
import { cn } from "@/lib/utils";
import Skeleton from "../../../components/ui/skeleton";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  stock: Pick<Stock, "symbol">;
}

export function StockAfterHoursLoading() {
  return (
    <Card className={cn("flex p-2 px-3 gap-3 items-center")}>
      <Skeleton>
        <CardDescription>After Hours:</CardDescription>
      </Skeleton>
      <Skeleton>
        <div className="flex items-center gap-1">
          <p className="text-[16px]">$</p>
        </div>
      </Skeleton>
    </Card>
  );
}

export default async function StockAfterHours({ stock, className }: Props) {
  const quote = await getQuote(stock.symbol);

  const positive: boolean =
    quote && quote.change ? (quote.change > 0 ? true : false) : true;

  return (
    <Card className={cn("flex p-2 px-3 gap-3 items-center", className)}>
      <CardDescription>After Hours:</CardDescription>
      <div className="flex items-center gap-1">
        <p className="text-[16px]">${quote?.price.toFixed(2) ?? "N/A"}</p>
        {positive ? (
          <ChevronsUp className="h-5 w-5 text-green-500" />
        ) : (
          <ChevronsDown className="h-5 w-5 text-red-500" />
        )}
        <p
          className={`text-[16px] ${
            positive ? "text-green-500" : "text-red-500"
          }`}>
          ({positive && "+"}
          {quote?.changesPercentage.toFixed(2) + "%" ?? "N/A"})
        </p>
      </div>
    </Card>
  );
}
