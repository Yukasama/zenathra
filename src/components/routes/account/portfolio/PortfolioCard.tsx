import { Portfolio } from "@/types/portfolio";
import Link from "next/link";
import { List } from "@/components/ui/stocks";
import DeleteButton from "@/components/routes/account/portfolio/DeleteButton";
import { Suspense } from "react";
import { ListLoading } from "@/components/ui/stocks/List";

type Props = {
  portfolio: Portfolio;
};

export default function PortfolioCard({ portfolio }: Props) {
  if (!portfolio) return <div>Not Found</div>;

  return (
    <div className="relative">
      <Link
        href={`/portfolios/${portfolio.id}`}
        className="f-col group min-h-[300px] p-5 box hover:bg-gray-200 dark:hover:bg-moon-800">
        <p className="text-lg font-medium">{portfolio.title}</p>
        <div>
          <Suspense fallback={<ListLoading limit={3} />}>
            {/*// @ts-ignore*/}
            <List
              symbols={portfolio.symbols}
              error="No Stocks in Portfolio"
              className="group-hover:scale-[1.01] duration-300"
              limit={3}
            />
          </Suspense>
        </div>
      </Link>
      <div className="absolute bottom-5 right-5">
        <DeleteButton portfolio={portfolio} />
      </div>
    </div>
  );
}
