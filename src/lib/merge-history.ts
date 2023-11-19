import "server-only";

import { db } from "@/db";
import { fetchHistory } from "./fmp/history";

export async function MergeHistory(portfolioId: string) {
  const stocksInPortfolio = await db.stockInPortfolio.findMany({
    where: { portfolioId },
    select: {
      createdAt: true,
      stock: {
        select: { symbol: true },
      },
    },
  });

  const data = await Promise.all(
    stocksInPortfolio.map((stock) =>
      fetchHistory(stock.stock.symbol, stock.createdAt)
    )
  );

  let result: any = {};

  // Merging history into average
  data.forEach((symbolData, i) => {
    Object.keys(symbolData).forEach((range) => {
      if (!result[range]) {
        result[range] = [];
      }

      symbolData[range].forEach((entry: any, entryIndex: any) => {
        if (!result[range][entryIndex]) {
          result[range][entryIndex] = {
            date: entry.date,
            close: 0,
            count: 0,
          };
        }

        if (new Date(entry.date) >= new Date(stocksInPortfolio[i].createdAt)) {
          result[range][entryIndex].close += entry.close;
          result[range][entryIndex].count++;
        }
      });
    });
  });

  // Adjusting result to calculate average and exclude days with no data
  Object.keys(result).forEach((range) => {
    result[range] = result[range]
      .filter((entry: any) => entry.count > 0)
      .map((entry: any) => {
        return {
          date: entry.date,
          close: entry.close / entry.count,
        };
      });
  });
}
