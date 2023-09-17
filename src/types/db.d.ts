import { User as PrismaUser } from "@prisma/client";
import { Portfolio } from "@prisma/client";

export type User = Omit<
  PrismaUser,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};

export interface PortfolioWithStocks extends Portfolio {
  stockIds: string[];
}

export type RecentStocks =
  | {
      stock: {
        symbol: string;
        image: string;
        companyName: string;
      };
    }[]
  | undefined;
