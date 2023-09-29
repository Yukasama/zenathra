import PageLayout from "@/components/shared/page-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/db";
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
  const session = await getAuthSession();
  if (session?.user.id !== id) return <p>Not your profile</p>;

  const user = await db.user.findFirst({
    where: { id },
  });

  if (!user) return notFound();

  const [portfolios, subscription] = await Promise.all([
    db.portfolio.findMany({
      select: { id: true, title: true, public: true, createdAt: true },
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
    <PageLayout
      title="My Profile"
      description="This page will be visible to everyone">
      <Card className="border-none rounded-none bg-gradient-to-br from-slate-400 to-slate-600">
        <CardHeader>
          <CardTitle>{user.username}</CardTitle>
          <CardDescription>{user.createdAt.toISOString()}</CardDescription>
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
