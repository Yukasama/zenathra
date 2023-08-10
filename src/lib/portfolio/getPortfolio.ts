import db from "@/lib/db";
import { User } from "@/types/user";
import { Portfolio } from "@/types/portfolio";

export async function getPortfolio(
  portfolioId: Portfolio["id"]
): Promise<Portfolio | null> {
  const rawPortfolio = await db.portfolio.findUnique({
    where: {
      id: portfolioId,
    },
  });

  if (!rawPortfolio) return null;

  return {
    ...rawPortfolio,
    createdAt: rawPortfolio.createdAt.toISOString(),
    updatedAt: rawPortfolio.updatedAt.toISOString(),
  };
}

export async function getPortfolios(userId: User["id"]): Promise<Portfolio[]> {
  const rawPortfolios = await db.portfolio.findMany({
    where: {
      userId: userId,
    },
  });

  return rawPortfolios.map((portfolio) => ({
    ...portfolio,
    createdAt: portfolio.createdAt.toISOString(),
    updatedAt: portfolio.updatedAt.toISOString(),
  }));
}
