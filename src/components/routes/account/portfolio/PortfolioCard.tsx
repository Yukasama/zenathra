import { Portfolio } from "@prisma/client";
import Link from "next/link";
import { BarChart2 } from "react-feather";
import { List } from "@/components/ui/stocks";
import DeleteButton from "@/components/routes/account/portfolio/DeleteButton";
import { Button } from "@/components/ui/buttons";
import { Suspense } from "react";
import { ListLoading } from "@/components/ui/stocks/List";

type Props = {
  portfolio: Portfolio;
};

export default function PortfolioCard({ portfolio }: Props) {
  if (!portfolio) return <div>Not Found</div>;

  return (
<<<<<<< HEAD
    <div className="relative flex h-full min-h-[300px] flex-col justify-between gap-4 p-5 box">
=======
    <div className="relative f-col h-full min-h-[300px] justify-between gap-4 rounded-lg bg-gray-200 p-5 dark:bg-moon-400">
>>>>>>> 6ec45fcfafcf127a94cdeb3520e36919e9c9d62a
      <p className="text-lg font-medium">{portfolio.title}</p>
      <div>
        <Suspense fallback={<ListLoading limit={3} />}>
          {/*// @ts-ignore*/}
          <List
            symbols={portfolio.symbols}
            error="No Stocks in Portfolio"
            limit={3}
          />
        </Suspense>
      </div>

      <div className="mt-1 flex w-full justify-between">
        <Link href={`/portfolios/${portfolio.id}`}>
          <Button
            color="blue"
            label="View"
            icon={<BarChart2 className="h-4 w-4" />}
          />
        </Link>
        <DeleteButton portfolio={portfolio} />
      </div>
    </div>
  );
}
