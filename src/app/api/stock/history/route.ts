import { historyUrls } from "@/config/fmp";
import {
  InternalServerErrorResponse,
  UnprocessableEntityResponse,
} from "@/lib/response";
import { historyTimes } from "@/config/fmp";
import { z } from "zod";
import axios from "axios";
import { StockHistorySchema } from "@/lib/validators/stock";

export async function POST(req: Request) {
  try {
    const { symbol, range } = StockHistorySchema.parse(await req.json());

    if (range === "Everything") {
      if (Array.isArray(symbol)) {
        const data = await Promise.all(
          symbol.map(async (s) => await fetchHistory(s))
        );
        return new Response(JSON.stringify(await getAverageClose(data)));
      }
      return new Response(JSON.stringify(await fetchHistory(symbol)));
    } else {
      const { data } = await axios.get(
        historyUrls(symbol as string, historyTimes[range][0])
      );

      const history: History[] =
        historyTimes[range][0] === "day1" ? data.historical : data;

      return history.slice(0, historyTimes[range][1]).reverse();
    }
  } catch (error) {
    if (error instanceof z.ZodError)
      return new UnprocessableEntityResponse(error.message);

    return new InternalServerErrorResponse();
  }
}

async function fetchHistory(symbol: string) {
  const fetches: History[][] = await Promise.all(
    ["min1", "min5", "min30", "day1"].map(async (time) => {
      const { data } = await axios.get(historyUrls(symbol, time));
      if (time === "day1") return data.historical;
      return data;
    })
  );

  return {
    "1D": fetches[0].slice(0, historyTimes["1D"][1]).reverse(),
    "5D": fetches[1].slice(0, historyTimes["5D"][1]).reverse(),
    "1M": fetches[2].slice(0, historyTimes["1M"][1]).reverse(),
    "6M": fetches[3].slice(0, historyTimes["6M"][1]).reverse(),
    "1Y": fetches[3].slice(0, historyTimes["1Y"][1]).reverse(),
    "5Y": fetches[3].slice(0, historyTimes["5Y"][1]).reverse(),
    ALL: fetches[3].slice(0, historyTimes["ALL"][1]).reverse(),
  };
}

async function getAverageClose(data: any) {
  const result = data.forEach((symbolData: any) => {
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
  return result;
}
