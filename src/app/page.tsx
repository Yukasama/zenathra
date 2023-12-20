import CompanyLogo from "@/components/shared/company-logo";
import { getStockQuotes } from "@/lib/fmp/quote";
import { SITE } from "@/config/site";
import LandingTable from "./landing-table";
import { db } from "@/db";
import PageLayout from "@/components/shared/page-layout";

export const metadata = { title: `Home | ${SITE.name}` };
// export const runtime = "edge";

export default async function page() {
  const stocks = await db.stock.findMany({
    select: {
      symbol: true,
      companyName: true,
      image: true,
      sector: true,
      mktCap: true,
    },
    where: {
      symbol: {
        not: {
          in: ["GOOGL"],
        },
      },
    },
    orderBy: {
      mktCap: "desc",
    },
    take: 200,
  });

  const stockQuotes = await getStockQuotes(stocks);

  return (
    <PageLayout className="f-col gap-4 items-center md:mx-8 lg:mx-24 xl:mx-32">
      <h1 className="text-[27px] font-black">
        Current Market Cap Rankings of Today&apos;s Stock Prices.
      </h1>
      <LandingTable stockQuotes={stockQuotes} />

      {/* Company logo in background */}
      <div className="fixed pointer-events-none top-0">
        <div
          aria-hidden="true"
          className="inset-x-0 blur-xl opacity-0 dark:opacity-10 -z-0">
          <CompanyLogo px={1000} />
        </div>
      </div>
    </PageLayout>
  );
}
