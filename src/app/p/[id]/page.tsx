import { Suspense } from "react";
import Image from "next/image";
import PortfolioAddModal from "@/components/portfolio-add-modal";
import PortfolioChart from "@/components/portfolio-chart";
import StockList from "@/components/stock-list";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import PageLayout from "@/components/page-layout";
import { Portfolio } from "@prisma/client";

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

interface NoStockProps {
  portfolio: Portfolio;
  stockIds: { stockId: string }[];
}

function NoStocks({ portfolio, stockIds }: NoStockProps) {
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

  // If the portfolio is private
  if (!portfolio.public && !session?.user)
    return <p>This Portfolio is private.</p>;

  if (session?.user.id === portfolio.creatorId && !stockIds.length)
    return <NoStocks portfolio={portfolio} stockIds={stockIds} />;

  const symbols = await db.stock.findMany({
    select: { symbol: true },
    where: { id: { in: stockIds.map((s) => s.stockId) } },
  });

  return (
    <PageLayout
      title={portfolio.title}
      description={`Created on ${portfolio.createdAt
        .toISOString()
        .split(",")}`}>
      {stockIds.length ? (
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
    </PageLayout>
  );
}
