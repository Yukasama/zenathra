import { Portfolio, Stock } from "@prisma/client";
import { Quote } from "./stock";

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

export type StockQuote = Stock & (Quote | undefined);
