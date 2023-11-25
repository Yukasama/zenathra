import { getIndexQuotes } from "@/lib/fmp/quote";
import StockPrice from "./[symbol]/stock-price";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { SkeletonList, SkeletonText } from "../../../components/ui/skeleton";

export function IndexListLoading() {
  return (
    <Card>
      <CardHeader>
        <SkeletonText />
      </CardHeader>
      <CardContent>
        <SkeletonList count={4} />
      </CardContent>
    </Card>
  );
}

export default async function IndexList() {
  const indexQuotes = await getIndexQuotes();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Index List</CardTitle>
        <CardDescription>Most popular indexes</CardDescription>
      </CardHeader>
      <CardContent className="f-col gap-4 w-full">
        {indexQuotes?.map((q) => (
          <div key={q.symbol} className="flex justify-between">
            <div>
              <h2 className="font-medium">{q.symbol}</h2>
              <p className="w-[100px] truncate text-sm text-zinc-500">
                {q.name}
              </p>
            </div>
            <StockPrice quote={q} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
