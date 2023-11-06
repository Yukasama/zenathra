import PortfolioList from "@/app/u/[id]/portfolio-list";
import { db } from "@/db";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import RecentStocks from "@/app/u/[id]/recent-stocks";
import { StockListLoading } from "@/components/stock/stock-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SITE } from "@/config/site";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Calendar } from "lucide-react";
import { getUser } from "@/lib/auth";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface Props {
  params: { id: string };
}

export const metadata = {
  title: `${SITE.name} | User Profile`,
};

export async function generateStaticParams() {
  const users = await db.user.findMany({
    select: { id: true },
  });

  return users.map((user) => ({ id: user.id }));
}

export default async function page({ params: { id } }: Props) {
  const user = await getUser();

  const dbUser = await db.user.findFirst({
    select: {
      createdAt: true,
      biography: true,
    },
    where: { id },
  });

  if (!dbUser) return notFound();

  return (
    <>
      <div className="relative">
        <div className="bg-gradient-to-br from-primary to-yellow-600 h-24 lg:h-40"></div>
        <UserAvatar
          user={user}
          fallbackFontSize={48}
          className="h-24 w-24 lg:w-48 lg:h-48 border absolute top-12 left-12 lg:top-16 lg:left-20"
        />
        <Card className="border-x-0 rounded-t-none px-7 pt-8 lg:pt-0 lg:pl-80 lg:pr-40">
          <CardHeader>
            <div className="flex justify-between">
              <div className="f-col gap-1">
                <CardTitle className="text-2xl lg:text-3xl font-medium">
                  ${user?.username}
                </CardTitle>
                <div className="text-zinc-500 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <p className="text-zinc-600">
                    Joined on {dbUser?.createdAt.toISOString().split("T")[0]}
                  </p>
                </div>
              </div>
              <Link
                href="/settings"
                className={cn(
                  buttonVariants({
                    variant: "subtle",
                  }),
                  "whitespace-nowrap"
                )}>
                Edit Profile
              </Link>
            </div>
          </CardHeader>
        </Card>
      </div>
      <div className="f-col lg:grid lg:grid-cols-3 p-6 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Biography</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-400">{dbUser?.biography}</p>
          </CardContent>
        </Card>
        <Suspense fallback={<StockListLoading className="w-full" />}>
          <PortfolioList user={{ id }} />
        </Suspense>
        <Suspense fallback={<StockListLoading className="w-full" />}>
          <RecentStocks user={{ id }} />
        </Suspense>
      </div>
    </>
  );
}
