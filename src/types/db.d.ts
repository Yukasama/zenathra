import { Portfolio, Stock } from "@prisma/client";
import { Quote } from "./stock";

export interface PortfolioWithStocks extends Portfolio {
  stocks: Stock[];
}
