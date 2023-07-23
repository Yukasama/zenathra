import { getUser } from "@/lib/user";
import { getStocks } from "@/lib/stocks/client/getStocks";
import { ListLoading } from "@/components/ui/stocks/List";
import { Suspense } from "react";
import Image from "next/image";
import List from "@/components/ui/stocks/List";
import {
  AddToPortfolio,
  AddButton,
} from "@/components/routes/account/portfolio";
import { getPortfolio } from "@/lib/portfolio/getPortfolio";
import notFound from "@/app/not-found";
import { ChartLoading } from "@/components/ui/charts/PriceChart";
import PortfolioChart from "@/components/routes/portfolios/PortfolioChart";
import { getAllPortfolios } from "@/lib/portfolio/managePortfolio";
import { Portfolio } from "@prisma/client";
import { User } from "@/types/user";

interface Params {
  params: { id: string };
}

export async function generateMetadata({ params: { id } }: Params) {
  const [user, portfolio]: [User | null, Portfolio | null] = await Promise.all([
    getUser(),
    getPortfolio(id),
  ]);

  if (!portfolio)
    return {
      title: "Portfolio not found",
    };

  if (!portfolio.public && user && user.id !== portfolio.userId)
    return {
      title: "This portfolio is private",
    };
  else {
    return {
      title: `Portfolios - ${portfolio.title}`,
    };
  }
}

// export async function generateStaticParams() {
//   const portfolios: Portfolio[] = await getAllPortfolios();

//   return portfolios.map((portfolio) => ({ id: portfolio.id }));
// }

export default async function PortfolioPage({ params: { id } }: Params) {
  const [user, portfolio]: [User | null, Portfolio | null] = await Promise.all([
    getUser(),
    getPortfolio(id),
  ]);

  if (!portfolio) return notFound();
  // If no stocks in portfolio
  else if (!portfolio.symbols.length) {
    if (user && user.id === portfolio.userId)
      return (
        <div>
          <div>
            <Image
              src="/images/nostocks.png"
              height={500}
              width={700}
              alt="No Stocks"
            />
          </div>
          <AddToPortfolio portfolio={portfolio} x={false} />
        </div>
      );
    else return <p>No Stocks in this portfolio.</p>;
  }

  // If the portfolio is private
  if (!portfolio.public && !user) return <p>This Portfolio is private.</p>;

  const stocks = await getStocks(portfolio.symbols);

  return (
    <div className="p-5">
      <h1 className="p-3 px-1 font-medium text-xl width-[300px] truncate">
        {portfolio.title}
      </h1>
      {stocks ? (
        <div className="flex gap-4">
          <Suspense fallback={<ChartLoading />}>
            {/*// @ts-ignore*/}
            <PortfolioChart symbols={portfolio.symbols} />
          </Suspense>
          <Suspense fallback={<ListLoading title="Portfolio Positions" />}>
            {/*// @ts-ignore*/}
            <List
              symbols={portfolio.symbols}
              title="Portfolio Positions"
              error="No Positions found"
            />
          </Suspense>
          {user && <AddButton portfolio={portfolio} />}
        </div>
      ) : (
        <h2>There was an error with the desired portfolio.</h2>
      )}
    </div>
  );
}
