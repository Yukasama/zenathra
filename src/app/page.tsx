import PriceChart from "@/components/price-chart";
import PageLayout from "@/components/shared/page-layout";
import { StockImage } from "@/components/stock/stock-image";
import StockList, { StockListLoading } from "@/components/stock/stock-list";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { getUser } from "@/lib/auth";
import { MoveRight } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function page() {
  const user = getUser();

  const symbols = ["AAPL", "MSFT", "GOOG", "TSLA"];
  const symbols2 = ["AAPL", "MSFT", "ENPH", "TSLA"];

  if (!user || !user.id)
    return (
      <>
        <div className="f-col z-10 items-center justify-center gap-4 mt-80">
          <h2 className="text-4xl font-light text-center shadow-sm shadow-slate-100/50 dark:shadow-slate-800/50">
            Explore your{" "}
            <span className="text-[#9089fc] font-medium decoration-2 underline-offset-4 underline">
              favourite
            </span>{" "}
            stocks.
          </h2>
          <div className="flex gap-3">
            <Button variant="subtle">Sign In</Button>
            <Button className="bg-gradient-to-tr from-[#ff80b5] to-[#9089fc]">
              Get started
              <MoveRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="absolute right-40 top-40 z-10 p-4 shadow-sm dark:shadow-lg rounded-lg">
          <Suspense fallback={<StockListLoading limit={4} />}>
            {/* @ts-expect-error Server Component */}
            <StockList symbols={symbols} />
          </Suspense>
        </div>
        <div className="relative isolate">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            />
          </div>
        </div>
      </>
    );

  const dbUser = await db.user.findFirst({
    where: { id: user.id },
  });

  if (!dbUser) redirect("/auth-callback?origin=/");

  return (
    <PageLayout
      title={`Welcome back, ${user.given_name} ${user.family_name ?? ""}!`}
      description="Your personal dashboard. Everything in one place."></PageLayout>
  );
}
