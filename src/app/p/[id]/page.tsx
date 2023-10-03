import { Suspense } from "react";
import PortfolioAddModal from "@/components/portfolio/portfolio-add-modal";
import PriceChart from "@/components/stock/price-chart";
import { db } from "@/db";
import { notFound } from "next/navigation";
import PageLayout from "@/components/shared/page-layout";
import PortfolioAssets from "@/components/portfolio/portfolio-assets";
import PortfolioAllocation from "@/components/portfolio/portfolio-allocation";
import { EyeOff } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/lib/auth";

export async function generateStaticParams() {
  const data = await db.portfolio.findMany({ select: { id: true } });

  return data.map((portfolio) => ({ id: portfolio.id }));
}

export async function generateMetadata({ params: { id } }: Props) {
  const user = getUser();
  const portfolio = await db.portfolio.findFirst({ where: { id } });

  if (!portfolio) return { title: "Portfolio not found" };
  if (!portfolio.public && user?.id !== portfolio.creatorId)
    return { title: "This portfolio is private" };

  return { title: `${portfolio.title} - Portfolio` };
}

interface Props {
  params: { id: string };
}

export default async function page({ params: { id } }: Props) {
  const portfolio = await db.portfolio.findFirst({
    include: {
      stocks: { select: { stockId: true } },
    },
    where: { id },
  });

  if (!portfolio) return notFound();

  const user = getUser();

  // Portfolio is private and it does not belong to the user
  if (!portfolio.public && !user)
    return (
      <div className="f-box f-col mt-96 gap-3">
        <div className="p-5 rounded-full w-20 h-12 f-box bg-primary">
          <EyeOff className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-medium">This Portfolio is private.</h2>
      </div>
    );

  // Portfolio belongs to user but no stocks added yet
  if (user?.id === portfolio.creatorId && !portfolio.stocks.length)
    return (
      <div className="f-box f-col gap-3 mt-80">
        <h2 className="font-medium text-lg">
          There are no stocks in this portfolio.
        </h2>
        <PortfolioAddModal portfolio={portfolio} />
      </div>
    );

  const stocks = await db.stock.findMany({
    where: { id: { in: portfolio.stocks.map((s) => s.stockId) } },
  });

  return (
    <>
      <Card className="rounded-none border-none">
        <CardHeader>
          <CardTitle>{portfolio.title}</CardTitle>
          <CardDescription>
            Created on{" "}
            {portfolio.createdAt.toISOString().split(".")[0].split("T")[0]}
          </CardDescription>
        </CardHeader>
      </Card>
      <PageLayout>
        {portfolio.stocks.length ? (
          <div className="f-col gap-4">
            <div className="flex f-col items-start lg:flex-row gap-4">
              <PriceChart
                symbols={stocks.map((s) => s.symbol)}
                title="Portfolio Chart"
                description="Chart of all portfolio positions"
              />
              <PortfolioAllocation stocks={stocks} />
            </div>
            <div className="flex">
              <Suspense fallback={<p>Loading...</p>}>
                {/* @ts-expect-error Server Component */}
                <PortfolioAssets
                  portfolio={portfolio}
                  symbols={stocks.map((s) => s.symbol)}
                  user={user}
                />
              </Suspense>
            </div>
          </div>
        ) : (
          <div className="f-box f-col gap-3 mt-80">
            <h2 className="font-medium text-lg">
              There are no stocks in this portfolio.
            </h2>
          </div>
        )}
      </PageLayout>
    </>
  );
}
