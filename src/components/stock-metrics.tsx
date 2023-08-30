import { Stock } from "@prisma/client";

interface Props {
  stock: Stock | null;
}

export default function StockMetrics({ stock }: Props) {
  return (
    <div>
      <div className="group flex animate-appear-up items-center gap-2 rounded-md p-2 px-5 hover:bg-slate-200 dark:hover:bg-zinc-400">
        <p className="w-7 text-[13px] font-medium">P/E</p>
        <div className="h-4 w-40 rounded-full bg-slate-200 transition-transform group-hover:scale-x-[1.03] group-hover:bg-slate-300 dark:bg-zinc-100 dark:group-hover:bg-zinc-200">
          <div className="h-4 w-2/3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></div>
        </div>
        <p className="text-[13px] font-medium">
          {stock ? stock.peRatioTTM.toFixed(2) : "N/A"}
        </p>
      </div>
      <div className="group flex animate-appear-up items-center gap-2 rounded-md p-2 px-5 hover:bg-slate-200 dark:hover:bg-zinc-400">
        <p className="w-7 text-[13px] font-medium">EPS</p>
        <div className="h-4 w-40 rounded-full bg-slate-200 transition-transform group-hover:scale-x-[1.03] group-hover:bg-slate-300 dark:bg-zinc-100 dark:group-hover:bg-zinc-200">
          <div className="h-4 w-2/3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></div>
        </div>
        <p className="text-[13px] font-medium">
          {stock ? stock.netIncomePerShareTTM?.toFixed(2) : "N/A"}
        </p>
      </div>
      <div className="group flex animate-appear-up items-center gap-2 rounded-md p-2 px-5 hover:bg-slate-200 dark:hover:bg-zinc-400">
        <p className="w-7 text-[13px] font-medium">P/B</p>
        <div className="h-4 w-40 rounded-full bg-slate-200 transition-transform group-hover:scale-x-[1.03] group-hover:bg-slate-300 dark:bg-zinc-100 dark:group-hover:bg-zinc-200">
          <div className="h-4 w-2/3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></div>
        </div>
        <p className="text-[13px] font-medium">
          {stock ? stock.priceToBookRatioTTM.toFixed(2) : "N/A"}
        </p>
      </div>
    </div>
  );
}
