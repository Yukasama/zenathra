import PortfolioWrapper from "@/components/portfolio/portfolio-wrapper";
import { StockListLoading } from "@/components/stock/stock-list";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function page() {
  const user = getUser()!;

  const dbUser = await db.user.findFirst({
    select: { biography: true },
    where: { id: user.id ?? undefined },
  });

  if (!dbUser) return redirect("/");

  return (
    <div className="f-col gap-4 w-full">
      <div className="f-col gap-1">
        <h2 className="font-light text-2xl">Your Portfolios</h2>
        <Separator />
      </div>
      <Suspense fallback={<StockListLoading className="w-full" />}>
        {/* @ts-expect-error Server Component */}
        <PortfolioWrapper user={user} />
      </Suspense>
    </div>
  );
}
