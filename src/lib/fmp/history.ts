import "server-only";

import { TIMEFRAMES, historyUrls } from "@/config/fmp/config";
import { History } from "@/types/stock";

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
        return data;
      }

      return data.map((item: History) => {
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
