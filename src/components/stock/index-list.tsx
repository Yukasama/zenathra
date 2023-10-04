import { getIndexQuotes } from "@/lib/fmp/quote";
import StockPrice from "./stock-price";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Skeleton from "../ui/skeleton";

export function IndexListLoading() {
  return (
    <Card>
      <CardHeader>
        <Skeleton>
          <CardTitle>Index List</CardTitle>
        </Skeleton>
        <Skeleton>
          <CardDescription>Most popular indexes</CardDescription>
        </Skeleton>
      </CardHeader>
      <CardContent className="f-col gap-4 w-full">
        {[
          Array(4).map((_, i) => (
            <Skeleton key={i}>
              <div>
                <h2 className="font-medium"></h2>
                <p className="w-[100px] truncate text-sm text-slate-500"></p>
              </div>
            </Skeleton>
          )),
        ]}
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
        {indexQuotes &&
          indexQuotes.map((q) => (
            <div key={q.symbol} className="flex justify-between">
              <div>
                <h2 className="font-medium">{q.symbol}</h2>
                <p className="w-[100px] truncate text-sm text-slate-500">
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
