import PortfolioList from "@/app/u/[id]/portfolio-list";
import { db } from "@/db";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import RecentStocks from "@/app/u/[id]/recent-stocks";
import { StockListLoading } from "@/components/stock/stock-list";
import UserOverview from "./user-overview";

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
      <UserOverview
        id={id}
        createdAt={dbUser?.createdAt.toISOString().split("T")[0]}
      />
      <div className="f-col lg:grid lg:grid-cols-3 p-6 gap-6">
        <div className="f-box">
          <p className="text-slate-400">{dbUser?.biography}</p>
        </div>
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
