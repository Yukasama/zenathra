import { db } from "@/db";
import PortfolioItem from "./portfolio-item";
import { User } from "@prisma/client";

interface Props {
  user: Pick<User, "id"> | undefined;
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
    where: { creatorId: user?.id },
  });

  return (
    <>
      {portfolios.map((portfolio) => (
        <PortfolioItem key={portfolio.id} portfolio={portfolio} />
      ))}
    </>
  );
}
