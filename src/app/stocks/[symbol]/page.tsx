import {
  BarProgress,
  Eye,
  Statistics,
  Interface,
  StockChart,
} from "@/components/routes/stocks/symbol";
import { getStock } from "@/lib/stocks/client/getStocks";
import { Stock } from "@prisma/client";
import List, { ListLoading } from "@/components/ui/stocks/List";
import { Suspense } from "react";
import { getUser } from "@/lib/user";
import notFound from "@/app/not-found";
import { User } from "@/types/user";
import { ChartLoading } from "@/components/ui/charts/PriceChart";
import { StatisticsLoading } from "@/components/routes/stocks/symbol/Statistics";
import { InterfaceLoading } from "@/components/routes/stocks/symbol/Interface";

// export async function generateStaticParams() {
//   const symbols = await getAllSymbols();

//   return symbols.map((symbol) => {
//     return {
//       params: {
//         symbol: symbol,
//       },
//     };
//   });
// }

interface Props {
  params: { symbol: string };
}

export default async function Symbol({ params: { symbol } }: Props) {
  const [user, stock]: [User | null, Stock | null] = await Promise.all([
    getUser(),
    getStock(symbol),
  ]);

  if (!stock) return notFound();

  return (
    <div className="m-4 overflow-x-hidden">
      <div className="flex w-full">
        <div className="w-full">
          <div className="flex items-center gap-10 border-b border-gray-300 pb-4 dark:border-moon-100">
            <Suspense fallback={<InterfaceLoading />}>
              {/*// @ts-ignore*/}
              <Interface user={user} stock={stock} />
            </Suspense>
            <BarProgress stock={stock} />
            <Eye stock={stock} user={user} />
          </div>
          <div className="my-4 flex gap-4 border-b border-gray-300 pb-4 dark:border-moon-100">
            <Suspense fallback={<ChartLoading />}>
              {/*// @ts-ignore*/}
              <StockChart symbol={symbol} />
            </Suspense>
            <Suspense
              fallback={<ListLoading title="Peers" className="wrapper" />}>
              {/*// @ts-ignore*/}
              <List
                symbols={stock.peersList.slice(0, 5)}
                title="Peers"
                error="No Peers found"
                className="wrapper"
              />
            </Suspense>
          </div>
        </div>
      </div>
      <Suspense fallback={<StatisticsLoading />}>
        {/*// @ts-ignore*/}
        <Statistics symbol={symbol} />
      </Suspense>
    </div>
  );
}
