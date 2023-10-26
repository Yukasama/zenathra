import { adminProcedure, router } from "../trpc";
import { db } from "@/db";
import { FMP } from "@/config/fmp/config";
import { TRPCError } from "@trpc/server";
import { getSymbols } from "@/lib/fmp/quote";
import { Timeout } from "@/lib/utils";
import { UploadStockSchema } from "@/lib/validators/stock";
import logger from "pino";
import { uploadStocks } from "@/lib/stock-upload";

export const databaseRouter = router({
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
