import { Portfolio } from "@prisma/client";

export interface PortfolioWithStocks extends Portfolio {
  stocks: StockInPortfolio[];
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
