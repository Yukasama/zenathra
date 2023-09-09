import { Suspense } from "react";
import Image from "next/image";
import PortfolioAddModal from "@/components/portfolio-add-modal";
import PortfolioChart from "@/components/charts/portfolio-chart";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import PageLayout from "@/components/shared/page-layout";
import PortfolioAssets from "@/components/portfolio-assets";
import { PortfolioWithStocks } from "@/types/db";
import PortfolioAllocation from "@/components/charts/portfolio-allocation";

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

  if (!portfolio) return { title: "Portfolio not found" };

  if (!portfolio.public && session?.user.id !== portfolio.creatorId)
    return { title: "This portfolio is private" };

  return { title: portfolio.title };
}

interface NoStockProps {
  portfolio: PortfolioWithStocks;
}

function NoStocks({ portfolio }: NoStockProps) {
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
    return (
      <NoStocks
        portfolio={{
          ...portfolio,
          stockIds: stockIds.map((s) => s.stockId),
        }}
      />
    );

  const stocks = await db.stock.findMany({
    where: { id: { in: stockIds.map((s) => s.stockId) } },
  });

  return (
    <PageLayout
      title={portfolio.title}
      description={`Created on ${portfolio.createdAt
        .toISOString()
        .split(",")}`}>
      {stockIds.length ? (
        <div className="f-col gap-4">
          <div className="flex gap-4">
            <Suspense fallback={<p>Loading...</p>}>
              <PortfolioChart stocks={stocks} />
            </Suspense>
            <PortfolioAllocation stocks={stocks} />
          </div>
          <div className="flex">
            <Suspense fallback={<p>Loading...</p>}>
              {/* @ts-expect-error Server Component */}
              <PortfolioAssets
                portfolio={{
                  ...portfolio,
                  stockIds: stockIds.map((s) => s.stockId),
                }}
                symbols={stocks.map((s) => s.symbol)}
              />
            </Suspense>
          </div>
        </div>
      ) : (
        <h2>There are no stocks in this portfolio.</h2>
      )}
    </PageLayout>
  );
}
