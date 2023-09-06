import PortfolioCard from "@/components/portfolio-card";
import PortfolioCreateCard from "@/components/portfolio-create-card";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import PageLayout from "@/components/page-layout";
import { noSub } from "@/config/subscription";

export default async function page() {
  const session = await getAuthSession();

  const [portfolios, subscription] = await Promise.all([
    db.portfolio.findMany({
      select: { id: true, title: true, public: true },
      where: { creatorId: session?.user.id },
    }),
    db.userSubscription.findFirst({
      where: { userId: session?.user.id },
    }),
  ]);

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
    <PageLayout title="My Portfolios" description="Manage your portfolios here">
      <div className="f-col gap-6 md:grid md:grid-cols-2 xl:gap-8 xl:grid-cols-3">
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
        {(subscription || portfolios.length < noSub.maxPortfolios) && (
          <PortfolioCreateCard numberOfPortfolios={portfolios.length} />
        )}
      </div>
    </PageLayout>
  );
}
