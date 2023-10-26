import { publicProcedure, adminProcedure, router } from "../trpc";
import { db } from "@/db";
import { z } from "zod";
import { buildFilter } from "@/config/screener/build-filter";
import axios from "axios";
import { TIMEFRAMES, historyUrls } from "@/config/fmp/config";
import { ScreenerSchema } from "@/lib/validators/stock";
import { History } from "@/types/stock";
import { fetchHistory } from "@/lib/stock-upload";
import { FMP } from "@/config/fmp/config";
import { TRPCError } from "@trpc/server";
import { getSymbols } from "@/lib/fmp/quote";
import { Timeout } from "@/lib/utils";
import { UploadStockSchema } from "@/lib/validators/stock";
import logger from "pino";
import { uploadStocks } from "@/lib/stock-upload";

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
    }),
  dailyHistory: publicProcedure.input(z.string()).query(async (opts) => {
    const { url } = TIMEFRAMES["1D"];
    const { data } = await axios.get(historyUrls(opts.input, url));
    return data as History[];
  }),
  upload: adminProcedure
    .input(UploadStockSchema)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { stock, skip, clean, pullTimes } = input;

      let alreadySymbols: string[] = [];
      if (skip) {
        const allStocks = await db.stock.findMany({
          select: { symbol: true },
        });
        alreadySymbols = allStocks.map((stock) => stock.symbol);
      }

      if (stock === "All" || stock === "US500") {
        const symbolArray = await getSymbols(stock, pullTimes);
        if (!symbolArray)
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        const totalIterations = symbolArray.length;
        let currentIteration = 0;

        for (let symbols of symbolArray) {
          currentIteration++;

          symbols = symbols.filter((s) => s && s !== null && s !== undefined);
          if (skip)
            symbols = symbols.filter((s) => !alreadySymbols.includes(s));
          if (symbols.length === 0) continue;

          await uploadStocks(symbols, user);
          logger().info(
            `[SUCCESS] Uploaded ${symbols.length} stocks including: '${
              symbols[0] ?? symbols[1] ?? "undefined"
            }'`
          );

          if (currentIteration !== totalIterations)
            await Timeout(Number(FMP.timeout));
        }
      } else await uploadStocks([stock], user);

      if (clean)
        await db.stock.deleteMany({
          where: { errorMessage: { not: null } },
        });
    }),
});
