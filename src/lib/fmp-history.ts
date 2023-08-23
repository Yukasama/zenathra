import "server-only";

import { historyUrls, historyTimes } from "@/config/fmp";
import { TimeFrame } from "@/types/stock";
import { env } from "@/env.mjs";

interface Props {
  symbol: string | string[];
  range: TimeFrame | "Everything";
}

export async function getHistory({ symbol, range }: Props) {
  try {
    if (range === "Everything") {
      if (Array.isArray(symbol)) {
        const data = await Promise.all(
          symbol.map(async (s) => await fetchHistory(s))
        );
        return await getAverageClose(data);
      }
      return await fetchHistory(symbol);
    } else {
      const response = await fetch(
        historyUrls(symbol, historyTimes[range][0]),
        {
          cache: "no-cache",
        }
      ).then(async (res) => await res.json());

      const history: History[] =
        historyTimes[range][0] === "day1" ? response.historical : response;

      return history.slice(0, historyTimes[range][1]).reverse();
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    if (env.NODE_ENV === "development") console.error(err);

    return null;
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
