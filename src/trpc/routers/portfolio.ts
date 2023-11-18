import { z } from "zod";
import { privateProcedure, router } from "../trpc";
import { db } from "@/db";
import { TRPCError } from "@trpc/server";
import {
  CreatePortfolioSchema,
  EditPortfolioSchema,
  ModifyPortfolioSchema,
} from "@/lib/validators/portfolio";
import { getRandomColor } from "@/lib/utils";
import { fetchHistory } from "@/lib/stock-upload";

export const portfolioRouter = router({
  create: privateProcedure
    .input(CreatePortfolioSchema)
    .mutation(async ({ ctx, input }) => {
      await db.portfolio.create({
        data: {
          ...input,
          public: !!input.public,
          creatorId: ctx.user.id,
          color: getRandomColor(),
        },
      });
    }),
  edit: privateProcedure
    .input(EditPortfolioSchema)
    .mutation(async ({ ctx, input }) => {
      const { portfolioId, title, public: isPublic } = input;

      await db.portfolio.update({
        where: {
          id: portfolioId,
          creatorId: ctx.user.id,
        },
        data: {
          ...(title && { title }),
          ...(isPublic !== undefined && { public: isPublic }),
        },
      });
    }),
  add: privateProcedure
    .input(ModifyPortfolioSchema)
    .mutation(async ({ ctx, input }) => {
      const { portfolioId, stockIds } = input;

      let portfolio = await db.portfolio.findFirst({
        select: {
          id: true,
          stocks: {
            select: { stockId: true },
          },
        },
        where: {
          id: portfolioId,
          creatorId: ctx.user.id,
        },
      });
      if (!portfolio) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const stocksInDatabase = await db.stock.findMany({
        select: { id: true },
        where: { id: { in: stockIds } },
      });

      const portfolioStockIds = portfolio.stocks.map((stock) => stock.stockId);
      const newStocks = stocksInDatabase
        .map((stock) => stock.id)
        .filter((id) => !portfolioStockIds.includes(id));

      await db.stockInPortfolio.createMany({
        data: newStocks.map((stockId) => ({
          portfolioId: portfolioId,
          stockId: stockId,
        })),
      });
    }),
  remove: privateProcedure
    .input(ModifyPortfolioSchema)
    .mutation(async ({ ctx, input }) => {
      const { portfolioId, stockIds } = input;

      await db.stockInPortfolio.deleteMany({
        where: {
          portfolioId: portfolioId,
          portfolio: {
            creatorId: ctx.user.id,
          },
          stockId: { in: stockIds },
        },
      });
    }),
  history: privateProcedure
    .input(z.string())
    .query(async ({ input: portfolioId }) => {
      const stocksInPortfolio = await db.stockInPortfolio.findMany({
        where: { portfolioId },
        select: {
          createdAt: true,
          stock: {
            select: { symbol: true },
          },
        },
      });

      const data = await Promise.all(
        stocksInPortfolio.map((stock) =>
          fetchHistory(stock.stock.symbol, stock.createdAt)
        )
      );

      let result: any = {};
      data.forEach((symbolData, i) => {
        Object.keys(symbolData).forEach((range) => {
          if (!result[range]) {
            result[range] = [];
          }

          symbolData[range].forEach((entry: any, entryIndex: any) => {
            if (!result[range][entryIndex]) {
              result[range][entryIndex] = {
                date: entry.date,
                close: 0,
                count: 0, // Count of stocks contributing to the average
              };
            }
            if (
              new Date(entry.date) >= new Date(stocksInPortfolio[i].createdAt)
            ) {
              result[range][entryIndex].close += entry.close;
              result[range][entryIndex].count++;
            }
          });
        });
      });

      // Adjusting result to calculate the average and exclude days with no data
      Object.keys(result).forEach((range) => {
        result[range] = result[range]
          .filter((entry: any) => entry.count > 0)
          .map((entry: any) => {
            return {
              date: entry.date,
              close: entry.close / entry.count, // Calculate the average
            };
          });
      });

      return result;
    }),
  delete: privateProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: portfolioId }) => {
      await db.portfolio.delete({
        where: {
          id: portfolioId,
          creatorId: ctx.user.id,
        },
      });
    }),
});
