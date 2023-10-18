import PageLayout from "@/components/shared/page-layout";
import StockCardList, {
  StockCardListLoading,
} from "@/components/stock/stock-card-list";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { getUser } from "@/lib/auth";
import { MoveRight } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function page() {
  const user = getUser();

  const symbols = ["AAPL", "MSFT", "GOOG", "TSLA"];

  if (!user || !user.id)
    return (
      <div className="f-col gap-10 items-center">
        <div className="f-col z-10 items-center justify-center gap-3 sm:gap-5 mt-24 sm:mt-32">
          <h2 className="text-4xl sm:text-6xl font-bold font-['Helvetica'] tracking-tight text-center w-4/5 max-w-[800px]">
            Explore and analyze your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9089fc] to-[#c47bff]">
              favourite
            </span>{" "}
            stocks.
          </h2>
          <p className="text-slate-400/90 text-md w-3/4 max-w-[600px] text-center">
            Manage a wide range of stocks from various industries and sectors,
            ensuring a diversified and balanced investment approach
          </p>
          <div className="flex gap-3 mt-2">
            <Button variant="subtle">Sign In</Button>
            <Button className="bg-gradient-to-br from-[#837afd] to-[#cc5eff]">
              Get started
              <MoveRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="w-4/5">
          <Suspense fallback={<StockCardListLoading />}>
            {/* @ts-expect-error Server Component */}
            <StockCardList
              title="Begin your journey"
              description="Start exploring popular stocks"
              symbols={symbols}
            />
          </Suspense>
        </div>
        <div className="relative isolate">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-[1000px] inset-x-0 -z-10 transform-gpu overflow-hidden blur-3xl">
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            />
          </div>
        </div>
      </div>
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
