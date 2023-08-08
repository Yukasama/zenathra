import {
  CreatePortfolioCard,
  PortfolioCard,
} from "@/components/routes/account/portfolio";
import { getUser } from "@/lib/user";
import { redirect } from "next/navigation";
import { getPortfolios } from "@/lib/portfolio/getPortfolio";

export default async function Portfolio() {
  const user = await getUser();
  if (!user) redirect("/auth/signin");

  const portfolios = await getPortfolios(user.id);

  return (
    <div className="f-col gap-10 p-4 lg:p-8 xl:grid xl:grid-cols-3 xl:p-12">
      {portfolios.map((portfolio) => (
        <div key={portfolio.id}>
          <PortfolioCard portfolio={portfolio} />
        </div>
      ))}
      {portfolios.length < 6 && <CreatePortfolioCard />}
    </div>
  );
}
