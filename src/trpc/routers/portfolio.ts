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

export const portfolioRouter = router({
  create: privateProcedure
    .input(CreatePortfolioSchema)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;

      await db.portfolio.create({
        data: {
          ...input,
          public: input.public,
          creatorId: user.id,
          color: getRandomColor(),
        },
      });
    }),
  edit: privateProcedure
    .input(EditPortfolioSchema)
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { portfolioId, title, public: isPublic } = input;

      await db.portfolio.update({
        where: {
          id: portfolioId,
          creatorId: userId,
        },
        data: {
          ...(title !== undefined && { title: title }),
          ...(isPublic !== undefined && { public: isPublic }),
        },
      });
    }),
  add: privateProcedure
    .input(ModifyPortfolioSchema)
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
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
          creatorId: userId,
        },
      });

      if (!portfolio) throw new TRPCError({ code: "NOT_FOUND" });

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
      const { userId } = ctx;
      const { portfolioId, stockIds } = input;

      await db.stockInPortfolio.deleteMany({
        where: {
          portfolioId: portfolioId,
          portfolio: {
            creatorId: userId,
          },
          stockId: { in: stockIds },
        },
      });
    }),
  delete: privateProcedure
    .input(z.string()) // Portfolio ID
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      await db.portfolio.delete({
        where: {
          id: input,
          creatorId: userId,
        },
      });
    }),
});
