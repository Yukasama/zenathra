import PortfolioCard from "@/app/portfolio/portfolio-card";
import { db } from "@/db";
import { getUser } from "@/lib/auth";
import PageLayout from "@/components/shared/page-layout";
import { PLANS } from "@/config/stripe";
import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import dynamic from "next/dynamic";
import Skeleton from "@/components/ui/skeleton";
import { SITE } from "@/config/site";

export const runtime = "edge";

export const metadata = {
  title: `${SITE.name} | Your Portfolios`,
};

const PortfolioCreateCard = dynamic(() => import("./portfolio-create-card"), {
  ssr: false,
  loading: () => <Skeleton className="min-h-72"></Skeleton>,
});

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
      <div className="f-col gap-6 md:grid md:grid-cols-2 xl:gap-8 xl:grid-cols-3">
        {portfolios.map((portfolio) => (
          <Suspense
            key={portfolio.id}
            fallback={<Card className="animate-pulse-right min-h-72" />}>
            <PortfolioCard portfolio={portfolio} />
          </Suspense>
        ))}
        {portfolios.length < PLANS[0].maxPortfolios && (
          <PortfolioCreateCard numberOfPortfolios={portfolios.length} />
        )}
      </div>
    </PageLayout>
  );
}
