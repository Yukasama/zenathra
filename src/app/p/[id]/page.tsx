import { Suspense } from "react";
import Image from "next/image";
import {
  PortfolioAddModal,
  PortfolioAddButton,
  PortfolioChart,
  StockChartLoading,
  StockList,
  StockListLoading,
} from "@/components";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface Params {
  params: { id: string };
}

export async function generateMetadata({ params: { id } }: Params) {
  const [session, portfolio] = await Promise.all([
    getAuthSession(),
    db.portfolio.findFirst({
      where: { id },
    }),
  ]);

  if (!portfolio)
    return {
      title: "Portfolio not found",
    };

  if (!portfolio.public && session?.user.id !== portfolio.creatorId)
    return {
      title: "This portfolio is private",
    };
  else {
    return {
      title: portfolio.title,
    };
  }
}

// export async function generateStaticParams() {
//   const { data, error } = await request("/api/portfolios/getAll");

//   return data.map((portfolio) => ({ id: portfolio.id }));
// }

export default async function page({ params: { id } }: Params) {
  const [session, portfolio, stockIds] = await Promise.all([
    getAuthSession(),
    db.portfolio.findFirst({
      where: { id },
    }),
    db.stockInPortfolio.findMany({
      select: { stockId: true },
      where: { portfolioId: id },
    }),
  ]);

  if (!portfolio) return notFound();
  else if (!stockIds.length) {
    if (session?.user.id === portfolio.creatorId)
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
          <PortfolioAddModal portfolio={portfolio} />
        </div>
      );
    else return <p>No Stocks in this portfolio.</p>;
  }

  // If the portfolio is private
  if (!portfolio.public && !user) return <p>This Portfolio is private.</p>;

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
            <PortfolioChart symbols={portfolio.symbols} />
          </Suspense>
          <Suspense
            fallback={
              <StockListLoading
                title="Portfolio Positions"
                className="wrapper"
              />
            }>
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
