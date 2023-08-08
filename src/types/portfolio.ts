import { Portfolio as PrismaPortfolio } from "@prisma/client";

export type Portfolio = Omit<PrismaPortfolio, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};
