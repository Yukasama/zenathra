import CompanyLogo from "@/components/shared/company-logo";
import StockCardList, {
  StockCardListLoading,
} from "@/components/stock/stock-card-list";
import { getQuotes } from "@/lib/fmp/quote";
import { Button } from "@nextui-org/button";
import { MoveRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default async function page() {
  // Custom selected symbols to display on landing page
  const symbols = ["AAPL", "MSFT", "GOOG", "TSLA", "NVDA", "AMZN"];
  const quotes = await getQuotes(symbols);

  return (
    <div className="f-col gap-12 items-center">
      {/* Landing Header */}
      <div className="f-col z-10 items-center justify-center gap-3 sm:gap-5 mt-20 sm:mt-28">
        <h2 className="text-4xl sm:text-6xl font-bold font-['Helvetica'] tracking-tight text-center w-4/5 max-w-[800px]">
          Explore and analyze your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fda37a] to-[#ffcc5e]">
            favourite
          </span>{" "}
          stocks.
        </h2>
        <p className="text-zinc-400/90 text-md w-3/4 max-w-[600px] text-center">
          Manage a wide range of stocks from various industries and sectors,
          ensuring a diversified and balanced investment approach.
        </p>
        <div className="flex gap-3 mt-2">
          <Link href="/sign-in">
            <Button aria-label="Sign In">Sign In</Button>
          </Link>
          <Link href="/sign-in">
            <Button className="gradient text-white" aria-label="Sign In">
              Get started
              <MoveRight size={18} />
            </Button>
          </Link>
        </div>
      </div>

      {/* Stock Cards */}
      <div className="w-5/6 sm:w-4/5 mb-10">
        <Suspense fallback={<StockCardListLoading />}>
          <StockCardList quotes={quotes} onlyInDb={false} />
        </Suspense>
      </div>

      {/* Absolute background elements */}
      <div className="fixed pointer-events-none top-0 sm:-top-40">
        <div
          aria-hidden="true"
          className="inset-x-0 transform-gpu overflow-hidden blur-3xl">
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#fda37a] to-[#ffcc5e] opacity-30 dark:opacity-[0.15] sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
      </div>

      {/* Company logo in background */}
      <div className="fixed pointer-events-none top-0">
        <div
          aria-hidden="true"
          className="inset-x-0 blur-xl opacity-0 dark:opacity-20 -z-0">
          <CompanyLogo px={1000} />
        </div>
      </div>
    </div>
  );
}
