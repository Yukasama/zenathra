import PortfolioList from "@/app/(user)/u/[id]/portfolio-list";
import { db } from "@/db";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import RecentStocks from "@/app/(user)/u/[id]/recent-stocks";
import { StockListLoading } from "@/components/stock/stock-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import Link from "next/link";
import { Avatar, Button } from "@nextui-org/react";

interface Props {
  params: { id: string };
}

export const metadata = { title: "User Profile" };

export async function generateStaticParams() {
  const users = await db.user.findMany({
    select: { id: true },
  });

  return users.map((user) => ({ id: user.id }));
}

export default async function page({ params: { id } }: Props) {
  const dbUser = await db.user.findFirst({
    select: {
      id: true,
      name: true,
      image: true,
      createdAt: true,
      biography: true,
    },
    where: { id },
  });

  if (!dbUser) {
    return notFound();
  }

  return (
    <>
      <div className="relative">
        <div className="bg-gradient-to-br from-primary to-yellow-600 h-24 lg:h-40" />
        <Avatar
          showFallback
          isBordered
          src={dbUser?.image ?? undefined}
          name={dbUser?.name?.[0].toUpperCase()}
          className="h-24 w-24 lg:w-48 lg:h-48 absolute top-12 left-12 lg:top-16 lg:left-20 text-xl lg:text-5xl"
          alt="profile picture"
        />

        <Card className="border-x-0 rounded-t-none px-7 pt-8 lg:pt-0 lg:pl-80 lg:pr-40">
          <CardHeader>
            <div className="flex justify-between">
              <div className="f-col gap-1">
                <CardTitle className="text-2xl lg:text-3xl font-medium">
                  {dbUser?.name}
                </CardTitle>
                <div className="text-zinc-400 flex items-center gap-2">
                  <Calendar size={20} />
                  Joined on {dbUser?.createdAt.toISOString().split("T")[0]}
                </div>
              </div>
              <Link href="/settings">
                <Button aria-label="Edit profile">Edit Profile</Button>
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
          <PortfolioList user={dbUser} />
        </Suspense>
        <Suspense fallback={<StockListLoading className="w-full" />}>
          <RecentStocks user={dbUser} />
        </Suspense>
      </div>
    </>
  );
}
