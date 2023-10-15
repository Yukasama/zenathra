import { db } from "@/db";
import type { KindeUser } from "@kinde-oss/kinde-auth-nextjs/server";
import PortfolioItem from "./portfolio-item";

interface Props {
  user: Pick<KindeUser, "id">;
}

export default async function PortfolioWrapper({ user }: Props) {
  const portfolios = await db.portfolio.findMany({
    select: {
      id: true,
      title: true,
      public: true,
      color: true,
      createdAt: true,
    },
    where: { creatorId: user.id },
  });

  return (
    <>
      {portfolios.map((portfolio) => (
        <PortfolioItem key={portfolio.id} portfolio={portfolio} />
      ))}
    </>
  );
}
