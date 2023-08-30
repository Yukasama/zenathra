"use client";

import StockPortfolioModifier from "./stock-portfolio-modifier";
import { PortfolioWithStocks } from "@/types/db";

interface Props {
  portfolios: PortfolioWithStocks[];
  symbolId: string;
}

export default function StockPortfolioAddModal({
  portfolios,
  symbolId,
}: Props) {
  return (
    <div className="f-col gap-2.5">
      {portfolios.map((portfolio) => (
        <StockPortfolioModifier
          key={portfolio.id}
          portfolio={portfolio}
          symbolId={symbolId}
        />
      ))}
    </div>
  );
}
