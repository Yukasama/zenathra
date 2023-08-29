import { getIndexQuotes } from "@/lib/fmp";
import StockPrice from "./stock-price";

export const IndexListLoading = () => {
  return <div className="animate-pulse-right flex min-h-[450px] flex-1"></div>;
};

export default async function IndexList() {
  const indexQuotes = await getIndexQuotes();

  return (
    <div className="f-col flex-1 w-full box xl:flex-row min-h-[450px]">
      <div className="f-col gap-2 w-full">
        {indexQuotes &&
          indexQuotes.map((q) => (
            <div
              key={q.symbol}
              className="flex justify-between rounded-md bg-slate-200 p-2 dark:bg-moon-400">
              <div>
                <h2>{q.symbol}</h2>
                <p className="w-[100px] truncate text-[12px] text-slate-500">
                  {q.name}
                </p>
              </div>
              <StockPrice quote={q} />
            </div>
          ))}
      </div>
    </div>
  );
}
