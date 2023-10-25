import PageLayout from "@/components/shared/page-layout";
import StockCardList, {
  StockCardListLoading,
} from "@/app/stocks/stock-card-list";
import { buttonVariants } from "@/components/ui/button";
import { db } from "@/db";
import { cn } from "@/lib/utils";
import {
  LoginLink,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { MoveRight } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const runtime = "edge";

export default async function page() {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const user = getUser();

  const symbols = ["AAPL", "MSFT", "GOOG", "TSLA", "NVDA", "AMZN"];

  if (!isAuthenticated())
    return (
      <div className="f-col gap-20 sm:gap-28 items-center">
        <div className="f-col z-10 items-center justify-center gap-3 sm:gap-5 mt-20 sm:mt-32">
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
            <LoginLink className={buttonVariants({ variant: "subtle" })}>
              Sign In
            </LoginLink>
            <LoginLink
              className={cn(
                buttonVariants(),
                "bg-gradient-to-br from-[#837afd] to-[#cc5eff] hover:from-[#7268ff] hover:to-[#c64aff]"
              )}>
              Get started
              <MoveRight className="w-4 h-4" />
            </LoginLink>
          </div>
        </div>
        <div className="w-5/6 sm:w-4/5">
          <Suspense fallback={<StockCardListLoading />}>
            <StockCardList symbols={symbols} isAuthenticated={false} />
          </Suspense>
        </div>
        <div className="fixed pointer-events-none top-0 sm:-top-40">
          <div
            aria-hidden="true"
            className="inset-x-0 transform-gpu overflow-hidden blur-3xl">
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-[0.25] sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            />
          </div>
        </div>
      </div>
    );

  const dbUser = await db.user.findFirst({
    select: { id: true },
    where: { id: user?.id ?? undefined },
  });

  if (!dbUser) redirect("/auth-callback?origin=/");

  return (
    <PageLayout
      title={`Welcome back, ${user?.given_name} ${user?.family_name ?? ""}!`}
      description="Your personal dashboard. Everything in one place.">
      <div className="mt-40 text-center text-3xl font-thin">Coming soon...</div>
    </PageLayout>
  );
}
