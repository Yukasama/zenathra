import {
  InternalServerErrorResponse,
  UnprocessableEntityResponse,
} from "@/lib/response";
import { z } from "zod";
import axios from "axios";
import { StockHistorySchema } from "@/lib/validators/stock";
import { TIMEFRAMES, historyUrls } from "@/config/fmp";

export async function POST(req: Request) {
  try {
    const { symbol } = StockHistorySchema.parse(await req.json());

    if (Array.isArray(symbol)) {
      const data = await Promise.all(symbol.map(fetchHistory));

      // Merging symbol data to get average
      let result: any = {};
      data.forEach((symbolData: any) => {
        Object.keys(symbolData).forEach((range) => {
          if (!result[range]) result[range] = [];

          symbolData[range].forEach((entry: any, entryIndex: any) => {
            if (!result[range][entryIndex]) {
              result[range][entryIndex] = {
                date: entry.date,
                close: 0,
              };
            }
            result[range][entryIndex].close += entry.close / data.length;
          });
        });
      });

      return new Response(JSON.stringify(result));
    }
    
    return new Response(JSON.stringify(await fetchHistory(symbol)));
  } catch (error) {
    if (error instanceof z.ZodError)
      return new UnprocessableEntityResponse(error.message);

    return new InternalServerErrorResponse();
  }
}

async function fetchHistory(symbol: string) {
  const fetchedURLs: Record<string, any> = {};

  for (let timeframe of Object.keys(TIMEFRAMES)) {
    const { url } = TIMEFRAMES[timeframe];
    if (!fetchedURLs[url]) {
      const { data } = await axios.get(historyUrls(symbol, url));
      fetchedURLs[url] = url.includes("price-full") ? data.historical : data;
    }
  }

  return Object.fromEntries(
    Object.entries(TIMEFRAMES).map(([timeframe, { url, limit }]) => {
      const relevantData = fetchedURLs[url];
      return [
        timeframe,
        timeframe !== "ALL"
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
