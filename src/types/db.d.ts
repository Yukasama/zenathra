import { User as PrismaUser } from "@prisma/client";

export type User = Omit<
  PrismaUser,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};

export type PortfolioWithStocks = {
  stockIds: {
    stockId: string;
  }[];
  title: string;
  image: string | null;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  creatorId: string;
  public: boolean;
};
