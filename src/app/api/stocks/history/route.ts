import { NextRequest, NextResponse } from "next/server";
import { historyUrls } from "@/config/fmpUrls";
import { NotFoundError, ServerError } from "@/lib/errors";
import { historyTimes } from "@/config/historyTimes";
import { fetchHistory, getAverageClose } from "@/lib/stocks/client/history";
import { z } from "zod";
import { fmpConfig } from "@/config/fmpApi";
import { history } from "@/config/fmpData";

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
