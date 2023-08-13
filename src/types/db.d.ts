import { Portfolio as PrismaPortfolio } from "@prisma/client";
import { User as PrismaUser } from "@prisma/client";

export type User = Omit<
  PrismaUser,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};

export type Portfolio = Omit<PrismaPortfolio, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};
