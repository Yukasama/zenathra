import Header from "@/components/ui/Header";
import {
  CreateButton,
  CreatePortfolio,
  PortfolioCard,
} from "@/components/routes/account/portfolio";
import { getUser } from "@/lib/user";
import { redirect } from "next/navigation";
import { Portfolio } from "@prisma/client";
import { getPortfolios } from "@/lib/portfolio/getPortfolio";

export default async function Portfolio() {
  const user = await getUser();
  if (!user) redirect("/auth/signin");

  const portfolios = await getPortfolios(user.id);

  return (
    <div className="h-full w-full">
      {!portfolios ? (
        <div className="flex-box h-full w-full flex-col gap-5">
          <Header
            header="You dont have any portfolios yet."
            subHeader="Create one here"
            center
          />
          <CreatePortfolio x={false} />
        </div>
      ) : (
        <div className="f-col gap-10 p-4 lg:p-14 xl:grid xl:grid-cols-3 xl:p-20">
          <>
            {portfolios.map((portfolio) => (
              <div key={portfolio.id}>
                <PortfolioCard portfolio={portfolio} />
              </div>
            ))}
          </>
          {/* If portfolio count does not exceed 3 */}
          {portfolios.length < 3 && (
            <div className="flex-box min-h-[300px] rounded-lg bg-gray-200 dark:bg-moon-400">
              <CreateButton />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
