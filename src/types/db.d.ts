import { Portfolio, Stock, StockInPortfolio } from "@prisma/client";
import { Quote } from "./stock";

export interface PortfolioWithStocks extends Portfolio {
  stocks: Pick<StockInPortfolio, "stockId">[];
}
