import { PortfolioCard, PortfolioCreateCard } from "@/components";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

export default async function page() {
  const session = await getAuthSession();

  const portfolios = await db.portfolio.findMany({
    where: { creatorId: session?.user.id },
    include: {
      stocks: {
        include: {
          stock: true,
        },
      },
    },
  });

  return (
    <div className="f-col gap-8 xl:gap-10 p-4 lg:p-8 xl:p-12 xl:grid xl:grid-cols-3">
      {portfolios.map((portfolio) => (
        <PortfolioCard
          key={portfolio.id}
          portfolio={{
            title: portfolio.title,
            id: portfolio.id,
            public: portfolio.public,
          }}
          stocks={portfolio.stocks}
        />
      ))}
      {portfolios.length < 6 && <PortfolioCreateCard />}
    </div>
  );
}
