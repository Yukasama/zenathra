import { publicProcedure, router } from "../trpc";
import { db } from "@/db";
import { z } from "zod";
import { buildFilter } from "@/config/screener/build-filter";
import axios from "axios";
import { TIMEFRAMES, historyUrls } from "@/config/fmp/config";
import { ScreenerSchema } from "@/lib/validators/stock";
import { History } from "@/types/stock";
import { fetchHistory } from "@/lib/stock-upload";

export const stockRouter = router({
  query: publicProcedure.input(ScreenerSchema).query(async (opts) => {
    const filter = buildFilter(opts.input);

    return await db.stock.findMany({
      select: {
        symbol: true,
        image: true,
        companyName: true,
        sector: true,
      },
      where: filter,
      take: opts.input.take,
      skip: (Number(opts.input.cursor) - 1) * opts.input.take,
      orderBy: { companyName: "asc" },
    });
  }),
  search: publicProcedure.input(z.string()).query(async (opts) => {
    return await db.stock.findMany({
      select: {
        id: true,
        symbol: true,
        image: true,
        companyName: true,
      },
      where: {
        OR: [
          { symbol: { contains: opts.input } },
          { companyName: { contains: opts.input } },
        ],
      },
      take: 10,
    });
  }),
  history: publicProcedure
    // Input is either a stock symbol or an array of symbols
    .input(z.string().or(z.array(z.string())))
    .query(async (opts) => {
      try {
        if (Array.isArray(opts.input)) {
          const data = await Promise.all(opts.input.map(fetchHistory));

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
          return result;
        }
        return await fetchHistory(opts.input);
      } catch {
        return {};
      }
    }),
  dailyHistory: publicProcedure.input(z.string()).query(async (opts) => {
    try {
      const { url } = TIMEFRAMES["1D"];
      const { data } = await axios.get(historyUrls(opts.input, url));
      return data as History[];
    } catch {
      return [];
    }
  }),
});
