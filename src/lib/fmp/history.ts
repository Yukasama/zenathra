import "server-only";

import { TIMEFRAMES, historyUrls } from "@/config/fmp/config";
import { History } from "@/types/stock";
import { db } from "@/db";
import pino from "pino";

export async function fetchHistory(
  symbol: string,
  from?: Date,
  allFields?: boolean
) {
  const fetchedURLs: Record<string, any> = {};

  for (let timeframe of Object.keys(TIMEFRAMES)) {
    const { url } = TIMEFRAMES[timeframe];

    if (!fetchedURLs[url]) {
      const result = await fetch(historyUrls(symbol, url, from)).then((res) =>
        res.json()
      );

      const data = (fetchedURLs[url] = url.includes("price-full")
        ? result.historical
        : result);

      if (allFields) {
        fetchedURLs[url] = data;
      }

      fetchedURLs[url] = data.map((item: History) => {
        return {
          date: item.date,
          close: item.close,
        };
      });
    }
  }

  return Object.fromEntries(
    Object.entries(TIMEFRAMES).map(([timeframe, { url, limit }]) => {
      const relevantData = fetchedURLs[url];

      return [
        timeframe,
        timeframe !== "All"
          ? relevantData
              .slice(
                0,
                relevantData.length < limit ? relevantData.length : limit
              )
              .reverse()
          : relevantData.reverse(),
      ];
    })
  );
}

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

  pino().debug("MergeHistory: stocksInPortfolio:", stocksInPortfolio);

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

        // Check if entry has date after stock was added to portfolio
        const entryAddedAfter =
          new Date(entry.date) >=
          new Date(stocksInPortfolio[i].createdAt.toDateString().split("T")[0]);

        if (entryAddedAfter) {
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

  pino().debug("MergeHistory:", result);
  return result;
}
