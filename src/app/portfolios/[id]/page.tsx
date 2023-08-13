import { getUser } from "@/lib/user";
import { getStocks } from "@/lib/stock-get";
import { Suspense } from "react";
import Image from "next/image";
import {
  PortfolioAddForm,
  PortfolioAddButton,
  PortfolioChart,
  StockChartLoading,
  StockList,
  StockListLoading,
} from "@/components";
import { getPortfolio } from "@/lib/portfolio-get";
import notFound from "@/app/not-found";
import { Portfolio, User } from "@/types/db";

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
//   const { data, error } = await request("/api/portfolios/getAll");

//   return data.map((portfolio) => ({ id: portfolio.id }));
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
          <PortfolioAddForm portfolio={portfolio} />
        </div>
      );
    else return <p>No Stocks in this portfolio.</p>;
  }

  // If the portfolio is private
  if (!portfolio.public && !user) return <p>This Portfolio is private.</p>;

  const stocks = await getStocks(portfolio.symbols);

  return (
    <div className="p-5">
      <div className="p-2 pb-4 px-1">
        <h1 className="font-medium text-xl width-[350px] truncate">
          {portfolio.title}
        </h1>
        <p className="text-sm text-slate-400">
          Created on {portfolio.createdAt.split("T")[0].replace(/-/g, "/")}
        </p>
      </div>
      {stocks ? (
        <div className="flex gap-4">
          <Suspense fallback={<StockChartLoading />}>
            {/*// @ts-ignore*/}
            <PortfolioChart symbols={portfolio.symbols} />
          </Suspense>
          <Suspense
            fallback={
              <StockListLoading
                title="Portfolio Positions"
                className="wrapper"
              />
            }>
            {/*// @ts-ignore*/}
            <StockList
              symbols={portfolio.symbols}
              title="Portfolio Positions"
              error="No Positions found"
              className="wrapper"
            />
          </Suspense>
          {user && <PortfolioAddButton portfolio={portfolio} />}
        </div>
      ) : (
        <h2>There was an error with the desired portfolio.</h2>
      )}
    </div>
  );
}
