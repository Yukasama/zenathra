import { Portfolio } from "@prisma/client";

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
