import PortfolioWrapper from "@/app/settings/portfolio/portfolio-wrapper";
import { StockListLoading } from "@/components/stock/stock-list";
import { Separator } from "@/components/ui/separator";
import { getUser } from "@/lib/auth";
import { Suspense } from "react";
import { SITE } from "@/config/site";

export const metadata = {
  title: `${SITE.name} | Portfolio Settings`,
};

export default async function page() {
  const user = await getUser();

  return (
    <div className="f-col gap-4 w-full">
      <div className="f-col gap-1">
        <h2 className="font-light text-2xl">Your Portfolios</h2>
        <Separator />
      </div>
      <Suspense fallback={<StockListLoading className="w-full" />}>
        <PortfolioWrapper user={user} />
      </Suspense>
    </div>
  );
}
