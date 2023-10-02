import PortfolioCard from "@/components/portfolio/portfolio-card";
import PortfolioCreateCard from "@/components/portfolio/portfolio-create-card";
import { db } from "@/db";
import { getUser } from "@/lib/auth";
import PageLayout from "@/components/shared/page-layout";
import { noSub } from "@/config/subscription";
import GridLayout from "@/components/shared/grid-layout";
import { Suspense } from "react";
import { Card } from "@/components/ui/card";

export default async function page() {
  const user = getUser();

  const portfolios = await db.portfolio.findMany({
    select: {
      id: true,
      title: true,
      public: true,
      createdAt: true,
      color: true,
      stocks: {
        select: { stockId: true },
      },
    },
    where: { creatorId: user?.id ?? undefined },
  });

  return (
    <PageLayout title="My Portfolios" description="Manage your portfolios here">
      <GridLayout>
        {portfolios.map((portfolio) => (
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
                stocks: portfolio.stocks.map((stock) => stock.stockId),
              }}
            />
          </Suspense>
        ))}
        {portfolios.length < noSub.maxPortfolios && (
          <PortfolioCreateCard numberOfPortfolios={portfolios.length} />
        )}
      </GridLayout>
    </PageLayout>
  );
}
