import PortfolioList from "@/components/portfolio/portfolio-list";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { UserAvatar } from "@/components/user/user-avatar";
import { db } from "@/db";
import { Calendar } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import RecentStocks from "@/components/user/recent-stocks";
import { StockListLoading } from "@/components/stock/stock-list";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { caller } from "@/trpc";

interface Props {
  params: { id: string };
}

// export async function generateStaticParams() {
//   const users = await db.user.findMany({
//     select: { id: true },
//   });

//   return users.map((user) => ({ id: user.id }));
// }

export default async function page({ params: { id } }: Props) {
  const dbUser = await db.user.findFirst({
    select: {
      createdAt: true,
      biography: true,
    },
    where: { id },
  });

  if (!dbUser) return notFound();

  const user = await caller.user.getbyId(id);

  return (
    <>
      <div className="relative">
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 h-24 lg:h-40"></div>
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
                  {`${user.given_name} ${user.family_name}`}
                </CardTitle>
                <div className="text-slate-500 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <p className="text-slate-600">
                    Joined on {dbUser?.createdAt.toISOString().split("T")[0]}
                  </p>
                </div>
              </div>
              <Link
                href="/settings/profile"
                className={buttonVariants({
                  variant: "subtle",
                })}>
                Edit Profile
              </Link>
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
          <PortfolioList user={{ id }} />
        </Suspense>
        <Suspense fallback={<StockListLoading className="w-full" />}>
          {/* @ts-expect-error Server Component */}
          <RecentStocks user={{ id }} />
        </Suspense>
      </div>
    </>
  );
}
