import PortfolioCard from "@/components/portfolio-card";
import PortfolioCreateCard from "@/components/portfolio-create-card";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import PageLayout from "@/components/page-layout";

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
    <PageLayout className="f-col gap-8 xl:gap-10 xl:grid xl:grid-cols-3">
      {flattenedPortfolios.map((portfolio) => (
        <>
          {/* @ts-expect-error Server Component */}
          <PortfolioCard
            key={portfolio.id}
            portfolio={{
              title: portfolio.title,
              id: portfolio.id,
              public: portfolio.public,
              stockIds: portfolio.stockIds.map((stock) => stock.stockId),
            }}
          />
        </>
      ))}
      {portfolios.length < 6 && <PortfolioCreateCard />}
    </PageLayout>
  );
}
