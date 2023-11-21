import { z } from "zod";
import { privateProcedure, publicProcedure, router } from "../trpc";
import { db } from "@/db";
import { TRPCError } from "@trpc/server";
import {
  CreatePortfolioSchema,
  EditPortfolioSchema,
} from "@/lib/validators/portfolio";
import { getRandomColor } from "@/lib/utils";
import { getUser } from "@/lib/auth";
import { MergeHistory } from "@/lib/fmp/history";

export const portfolioRouter = router({
  create: privateProcedure
    .input(CreatePortfolioSchema)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { title, isPublic } = input;

      await db.portfolio.create({
        data: {
          title,
          isPublic: !!isPublic,
          creatorId: user.id,
          color: getRandomColor(),
        },
      });
    }),
  edit: privateProcedure
    .input(EditPortfolioSchema)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { portfolioId, title, isPublic } = input;

      await db.portfolio.update({
        data: {
          ...(title && { title }),
          ...(isPublic !== undefined && { isPublic: !!isPublic }),
        },
        where: {
          id: portfolioId,
          creatorId: user.id,
        },
      });
    }),
  add: privateProcedure
    .input(EditPortfolioSchema)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { portfolioId, stockIds } = input;

      if (stockIds?.length === 0) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      let portfolio = await db.portfolio.findFirst({
        select: {
          id: true,
          stocks: {
            select: { stockId: true },
          },
        },
        where: {
          id: portfolioId,
          creatorId: user.id,
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
    .input(EditPortfolioSchema)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { portfolioId, stockIds } = input;

      if (stockIds?.length === 0) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      await db.stockInPortfolio.deleteMany({
        where: {
          portfolioId: portfolioId,
          portfolio: {
            creatorId: user.id,
          },
          stockId: { in: stockIds },
        },
      });
    }),
  history: publicProcedure
    .input(z.string())
    .query(async ({ input: portfolioId }) => {
      const portfolioExists = await db.portfolio.findFirst({
        select: {
          isPublic: true,
          creatorId: true,
        },
        where: { id: portfolioId },
      });

      if (!portfolioExists) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (portfolioExists.isPublic) {
        return await MergeHistory(portfolioId);
      }

      const user = await getUser();

      if (user?.id !== portfolioExists.creatorId) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return await MergeHistory(portfolioId);
    }),
  delete: privateProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: portfolioId }) => {
      const { user } = ctx;

      await db.portfolio.delete({
        where: {
          id: portfolioId,
          creatorId: user.id,
        },
      });
    }),
});
