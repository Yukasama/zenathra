import { Suspense } from "react";
import Image from "next/image";
import PortfolioAddModal from "@/components/portfolio-add-modal";
import PortfolioChart from "@/components/portfolio-chart";
import StockList from "@/components/stock-list";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

export async function generateStaticParams() {
  const data = await db.portfolio.findMany({
    select: { id: true },
  });

  return data.map((portfolio) => ({ id: portfolio.id }));
}

export async function generateMetadata({ params: { id } }: Props) {
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

  return {
    title: portfolio.title,
  };
}

export default async function page({ params: { id } }: Props) {
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

  if (!stockIds.length) {
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
          <PortfolioAddModal
            portfolio={portfolio}
            stockIds={stockIds.map((s) => s.stockId)}
          />
        </div>
      );
    return <p>No Stocks in this portfolio.</p>;
  }

  // If the portfolio is private
  if (!portfolio.public && !session?.user)
    return <p>This Portfolio is private.</p>;

  const symbols = await db.stock.findMany({
    select: { symbol: true },
    where: { id: { in: stockIds.map((s) => s.stockId) } },
  });

  return (
    <div className="p-5">
      <div className="p-2 pb-4 px-1">
        <h1 className="font-medium text-xl width-[350px] truncate">
          {portfolio.title}
        </h1>
        <p className="text-sm text-slate-400">
          Created on {portfolio.createdAt.toISOString().split(",")}
        </p>
      </div>
      {stockIds ? (
        <div className="flex gap-4">
          <Suspense fallback={<p>Loading...</p>}>
            <PortfolioChart symbols={symbols.map((s) => s.symbol)} />
          </Suspense>
          <Suspense fallback={<p>Loading...</p>}>
            {/* @ts-expect-error Server Component */}
            <StockList
              symbols={symbols.map((s) => s.symbol)}
              title="Portfolio Positions"
              error="No Positions found"
              className="wrapper"
            />
          </Suspense>
          {session?.user && (
            <PortfolioAddModal
              portfolio={portfolio}
              stockIds={stockIds.map((s) => s.stockId)}
            />
          )}
        </div>
      ) : (
        <h2>There are no stocks in this portfolio.</h2>
      )}
    </div>
  );
}
