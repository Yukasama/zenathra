import { ChevronsUp, ChevronsDown } from "lucide-react";
import { getAfterHoursQuote } from "@/lib/fmp/quote";
import { Card, CardDescription } from "@/components/ui/card";
import { SkeletonText } from "@/components/ui/skeleton";
import { StockQuote } from "@/types/stock";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  stockQuote: Pick<StockQuote, "symbol" | "price">;
}

export function StockAfterHoursLoading() {
  return (
    <Card className="flex p-2 px-3 gap-3 items-center">
      <SkeletonText count={1} />
    </Card>
  );
}

export default async function StockAfterHours({ stockQuote }: Props) {
  const afterHoursQuote = await getAfterHoursQuote(stockQuote.symbol);

  if (!afterHoursQuote || !stockQuote.price) {
    return (
      <Card className="flex p-2 px-3 gap-3 items-center">
        <CardDescription>After Hours: Failed to load</CardDescription>
      </Card>
    );
  }

  const changesPercentage =
    (afterHoursQuote?.price / stockQuote.price) * 100 - 1 ?? 0;
  const positive = changesPercentage >= 0;

  return (
    <Card className="flex p-2 px-3 gap-3 items-center">
      <CardDescription>After Hours:</CardDescription>
      <div className="flex items-center gap-1">
        <p className="text-[16px]">${afterHoursQuote?.price?.toFixed(2)}</p>
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
          {changesPercentage?.toFixed(2) + "%"})
        </p>
      </div>
    </Card>
  );
}
