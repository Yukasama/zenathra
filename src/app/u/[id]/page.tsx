import PageLayout from "@/components/shared/page-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/db";
import { getUser } from "@/lib/auth";
import { EyeOff } from "lucide-react";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

export async function generateStaticParams() {
  const users = await db.user.findMany({
    select: { id: true },
  });

  return users.map((user) => ({ id: user.id }));
}

export default async function page({ params: { id } }: Props) {
  const user = getUser();

  if (!user) return notFound();

  if (user.id !== id)
    return (
      <div className="f-box f-col mt-96 gap-3">
        <div className="p-5 rounded-full w-20 h-12 f-box bg-primary">
          <EyeOff className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-medium">This Portfolio is private.</h2>
      </div>
    );
  
  const dbUser = await db.user.findFirst({
    where: { id },
    select: { createdAt: true },
  });

  const portfolios = await db.portfolio.findMany({
    select: { id: true, title: true, public: true, createdAt: true },
    where: { creatorId: user.id },
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
    <PageLayout
      title="My Profile"
      description="This page will be visible to everyone">
      <Card className="border-none rounded-none bg-gradient-to-br from-slate-400 to-slate-600">
        <CardHeader>
          <CardTitle>{user.given_name}</CardTitle>
          <CardDescription>Joined in {user..toISOString()}</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <h2>Portfolios</h2>
            {flattenedPortfolios.map((portfolio) => (
              <Card key={portfolio.id}>
                <CardHeader>
                  <div className="flex">
                    <div className="bg-primary f-box rounded-full h-10 w-10">
                      {portfolio.title[0].toUpperCase()}
                    </div>
                    <div>
                      <CardTitle>{portfolio.title}</CardTitle>
                      <CardDescription>
                        {portfolio.createdAt.toISOString()}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
