import { NextRequest, NextResponse } from "next/server";
import { historyUrls } from "@/config/fmp";
import { NotFoundError, ServerError } from "@/lib/errors";
import { historyTimes } from "@/config/fmp";
import { z } from "zod";

const Schema = z.object({
  symbol: z.string(),
  range: z.enum(["1D", "5D", "1M", "6M", "1Y", "5Y", "ALL", "Everything"]),
});

export async function POST(req: NextRequest) {
  try {
    const { symbol, range } = Schema.parse(await req.json());

    let data = null;

    if (range === "Everything") {
      if (Array.isArray(symbol)) {
        if (Array.isArray(symbol)) {
          const data = await Promise.all(
            symbol.map(async (s) => await fetchHistory(s))
          );
          const averageData = await getAverageClose(data);
          return NextResponse.json(averageData);
        }
      }
      data = await fetchHistory(symbol);
    } else {
      const response = await fetch(
        historyUrls(symbol, historyTimes[range][0]),
        {
          cache: "no-cache",
        }
      )
        .then(async (res) => await res.json())
        .catch(() => {
          throw new ServerError("Fetch from FMP failed");
        });

      const history: History[] =
        historyTimes[range][0] === "day1" ? response.historical : response;

      if (!history.length)
        throw new NotFoundError("No data found for this stock.");

      data = history.slice(0, historyTimes[range][1]).reverse();
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: err.status || 500 }
    );
  }
}

async function fetchHistory(symbol: string) {
  const fetches: History[][] = await Promise.all(
    ["min1", "min5", "min30", "day1"].map((time) => {
      return fetch(historyUrls(symbol, time), {
        cache: "no-cache",
      })
        .then(async (res) => {
          if (time === "day1") {
            return await res.json().then((data) => data.historical);
          } else {
            return await res.json();
          }
        })
        .catch(() => null);
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
  const result: any = {};

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
  return result;
}
