import PortfolioCard from "@/components/portfolio/portfolio-card";
import PortfolioCreateCard from "@/components/portfolio/portfolio-create-card";
import { db } from "@/db";
import { getAuthSession } from "@/lib/auth";
import PageLayout from "@/components/shared/page-layout";
import { noSub } from "@/config/subscription";
import GridLayout from "@/components/shared/grid-layout";
import { Suspense } from "react";
import { Card } from "@/components/ui/card";

export default async function page() {
  const session = await getAuthSession();

  const [portfolios, subscription] = await Promise.all([
    db.portfolio.findMany({
      select: { id: true, title: true, public: true, color: true },
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
      <GridLayout>
        {flattenedPortfolios.map((portfolio) => (
          <Suspense
            key={portfolio.id}
            fallback={<Card className="animate-pulse-right min-h-72" />}>
            {/* @ts-expect-error Server Component */}
            <PortfolioCard
              portfolio={{
                title: portfolio.title,
                id: portfolio.id,
                public: portfolio.public,
                color: portfolio.color,
                stockIds: portfolio.stockIds.map((stock) => stock.stockId),
              }}
            />
          </Suspense>
        ))}
        {(subscription || portfolios.length < noSub.maxPortfolios) && (
          <PortfolioCreateCard numberOfPortfolios={portfolios.length} />
        )}
      </GridLayout>
    </PageLayout>
  );
}
