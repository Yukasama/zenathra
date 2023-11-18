import { publicProcedure, adminProcedure, router } from "../trpc";
import { db } from "@/db";
import { z } from "zod";
import { buildFilter } from "@/config/screener/build-filter";
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
  query: publicProcedure.input(ScreenerSchema).query(async ({ input }) => {
    const { cursor, take } = input;

    const filter = buildFilter(input);
    const paginationSkip = (cursor - 1) * take;

    return await db.stock.findMany({
      select: {
        symbol: true,
        image: true,
        companyName: true,
        sector: true,
      },
      where: filter,
      take: take,
      skip: paginationSkip,
      orderBy: { companyName: "asc" },
    });
  }),
  search: publicProcedure.input(z.string()).query(async ({ input: search }) => {
    return await db.stock.findMany({
      select: {
        id: true,
        symbol: true,
        image: true,
        companyName: true,
      },
      where: {
        OR: [
          { symbol: { contains: search } },
          { companyName: { contains: search } },
        ],
      },
      take: 10,
    });
  }),
  history: publicProcedure
    .input(z.string())
    .query(async ({ input: symbol }) => {
      return await fetchHistory(symbol);
    }),
  dailyHistory: publicProcedure
    .input(z.string())
    .query(async ({ input: symbol }) => {
      const { url } = TIMEFRAMES["1D"];
      const data = await fetch(historyUrls(symbol, url)).then((res) =>
        res.json()
      );
      return data as History[];
    }),
  upload: adminProcedure
    .input(UploadStockSchema)
    .mutation(async ({ ctx, input }) => {
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
        if (!symbolArray) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }

        const totalIterations = symbolArray.length;
        let currentIteration = 0;

        for (let symbols of symbolArray) {
          currentIteration++;

          symbols = symbols.filter((s) => s && s !== null && s !== undefined);
          if (skip) {
            symbols = symbols.filter((s) => !alreadySymbols.includes(s));
          }
          if (symbols.length === 0) {
            continue;
          }

          await uploadStocks(symbols, ctx.user);
          logger().info(
            `[SUCCESS] Uploaded ${symbols.length} stocks including: '${
              symbols[0] ?? symbols[1] ?? "undefined"
            }'`
          );

          if (currentIteration !== totalIterations) {
            await Timeout(Number(FMP.timeout));
          }
        }
      } else {
        await uploadStocks([stock], ctx.user);
      }

      if (clean) {
        await db.stock.deleteMany({
          where: { errorMessage: { not: null } },
        });
      }
    }),
});
