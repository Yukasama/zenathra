import { publicProcedure, adminProcedure, router } from "../trpc";
import { db } from "@/db";
import { z } from "zod";
import { buildFilter } from "@/config/screener/build-filter";
import { HistorySchema, ScreenerSchema } from "@/lib/validators/stock";
import { History } from "@/types/stock";
import { fetchHistory } from "@/lib/fmp/history";
import { FMP } from "@/config/fmp/config";
import { TRPCError } from "@trpc/server";
import { getSymbols } from "@/lib/fmp/quote";
import { Timeout } from "@/lib/utils";
import { UploadStockSchema } from "@/lib/validators/stock";
import pino from "pino";
import { uploadStocks } from "@/lib/fmp/upload";

export const stockRouter = router({
  query: publicProcedure.input(ScreenerSchema).query(async ({ input }) => {
    const { cursor = 1, take = 10 } = input;

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
  history: publicProcedure.input(HistorySchema).query(async ({ input }) => {
    const { symbol, timeframe, allFields } = input;

    return (await fetchHistory({ symbol, timeframe, allFields })) as History[];
  }),
  upload: adminProcedure
    .input(UploadStockSchema)
    .mutation(async ({ ctx, input }) => {
      const { stock, skip, clean, pullTimes } = input;

      let alreadyInDb: string[] = [];

      if (skip) {
        const allStocks = await db.stock.findMany({
          select: { symbol: true },
        });

        alreadyInDb = allStocks.map((stock) => stock.symbol);
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
            symbols = symbols.filter((s) => !alreadyInDb.includes(s));
          }

          if (symbols.length === 0) {
            continue;
          }

          await uploadStocks(symbols, ctx.user);

          pino().info(
            `[SUCCESS] Uploaded ${symbols.length} stocks including: '${
              symbols[0] ?? symbols[1] ?? "undefined"
            }'`
          );

          // FMP API has a limit of 300 requests per minute
          if (currentIteration !== totalIterations) {
            await Timeout(Number(FMP.timeout));
          }
        }
      } else {
        await uploadStocks([stock], ctx.user);
      }

      if (clean) {
        const deleted = await db.stock.deleteMany({
          where: { errorMessage: { not: null } },
        });

        pino().info(
          `[SUCCESS] Database cleared. Deleted ${deleted.count} stock/stocks`
        );
      }
    }),
});
