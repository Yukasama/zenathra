import db from "@/lib/db";
import { User } from "@/types/user";
import { Portfolio } from "@prisma/client";

export async function getPortfolio(portfolioId: Portfolio["id"]) {
  return await db.portfolio.findUnique({
    where: {
      id: portfolioId,
    },
  });
}

export async function getPortfolios(userId: User["id"]) {
  return await db.portfolio.findMany({
    where: {
      userId: userId,
    },
  });
}
