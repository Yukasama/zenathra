import { getIndexQuotes } from "@/lib/fmp/quote";
import StockPrice from "./stock-price";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export const IndexListLoading = () => {
  return <div className="animate-pulse-right flex min-h-[450px] flex-1"></div>;
};

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
