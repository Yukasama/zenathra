import { PortfolioCard, PortfolioCreateCard } from "@/components";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

export default async function page() {
  const session = await getAuthSession();

  const portfolios = await db.portfolio.findMany({
    where: { creatorId: session?.user.id },
  });

  const flattenedPortfolios = await Promise.all(
    portfolios.map(async (portfolio) => ({
      ...portfolio,
      stockIds: await db.stockInPortfolio.findMany({
        select: { stockId: true },
        where: { portfolioId: portfolio.id },
      }),
    }))
  );

  return (
    <div className="f-col gap-8 xl:gap-10 p-4 lg:p-8 xl:p-12 xl:grid xl:grid-cols-3">
      {flattenedPortfolios.map((portfolio) => (
        <PortfolioCard
          key={portfolio.id}
          portfolio={{
            title: portfolio.title,
            id: portfolio.id,
            public: portfolio.public,
          }}
          stockIds={portfolio.stockIds.map((stock) => stock.stockId)}
        />
      ))}
      {portfolios.length < 6 && <PortfolioCreateCard />}
    </div>
  );
}
