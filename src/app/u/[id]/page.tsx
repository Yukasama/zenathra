import PortfolioList from "@/components/portfolio/portfolio-list";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { UserAvatar } from "@/components/user/user-avatar";
import { db } from "@/db";
import { getUser } from "@/lib/auth";
import { Calendar } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import RecentStocks from "@/components/user/recent-stocks";
import { StockListLoading } from "@/components/stock/stock-list";
import { Button } from "@/components/ui/button";

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

  const dbUser = await db.user.findFirst({
    select: {
      createdAt: true,
      status: true,
      biography: true,
    },
    where: { id },
  });

  return (
    <>
      <div className="relative">
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 h-28 lg:h-40"></div>
        <UserAvatar
          user={user}
          className="h-24 w-24 lg:w-48 lg:h-48 border absolute top-16 left-12 lg:top-16 lg:left-20"
        />
        <Card className="border-x-0 rounded-t-none px-8 pt-10 lg:pt-0 lg:px-80">
          <CardHeader>
            <div className="flex justify-between">
              <div className="f-col gap-1">
                <CardTitle className="text-3xl font-medium">
                  {`${user.given_name} ${user.family_name}`}
                </CardTitle>
                <p className="text-slate-400">{dbUser?.status}</p>
                <div className="text-slate-500 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <p className="text-slate-600">
                    Joined on {dbUser?.createdAt.toISOString().split("T")[0]}
                  </p>
                </div>
              </div>
              <Button variant="subtle">Edit Profile</Button>
            </div>
          </CardHeader>
        </Card>
      </div>
      <div className="f-col lg:grid lg:grid-cols-3 p-6 gap-6">
        <div className="f-box">
          <p className="text-slate-400">{dbUser?.biography}</p>
        </div>
        <Suspense fallback={<StockListLoading className="w-full" />}>
          {/* @ts-expect-error Server Component */}
          <PortfolioList user={user} />
        </Suspense>
        <Suspense fallback={<StockListLoading className="w-full" />}>
          {/* @ts-expect-error Server Component */}
          <RecentStocks user={user} />
        </Suspense>
      </div>
    </>
  );
}
