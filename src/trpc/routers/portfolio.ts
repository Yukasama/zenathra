import { z } from "zod";
import { privateProcedure, publicProcedure, router } from "../trpc";
import { db } from "@/db";
import { TRPCError } from "@trpc/server";
import {
  CreatePortfolioSchema,
  ModifyPortfolioSchema,
} from "@/lib/validators/portfolio";

const BASE_COLORS = ["#0088FE", "#00C49F", "#A463F2", "#20B2AA", "#7C4DFF"];

function getRandomColor(): string {
  const randomIndex = Math.floor(Math.random() * BASE_COLORS.length);
  return BASE_COLORS[randomIndex];
}

export const portfolioRouter = router({
  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async (opts) => {
      return await db.portfolio.findFirst({
        where: {
          id: opts.input.id,
        },
      });
    }),
  create: privateProcedure
    .input(CreatePortfolioSchema)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;

      return await db.portfolio.create({
        data: {
          ...input,
          public: input.publicPortfolio,
          creatorId: user.id!,
          color: getRandomColor(),
        },
      });
    }),
  add: privateProcedure
    .input(ModifyPortfolioSchema)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { portfolioId, stockIds } = input;

      let portfolio = await db.portfolio.findFirst({
        select: { id: true },
        where: {
          id: portfolioId,
          creatorId: user?.id ?? undefined,
        },
      });

      if (!portfolio) throw new TRPCError({ code: "NOT_FOUND" });

      const stocksInDatabase = await db.stock.findMany({
        select: { id: true },
        where: { id: { in: stockIds } },
      });

      const portfolioStocks = await db.stockInPortfolio.findMany({
        select: { stockId: true },
        where: { portfolioId: portfolioId },
      });

      const portfolioStockIds = portfolioStocks.map((stock) => stock.stockId);

      const newStocks = stocksInDatabase
        .map((stock) => stock.id)
        .filter((id) => !portfolioStockIds.includes(id));

      await db.stockInPortfolio.createMany({
        data: newStocks.map((stockId) => ({
          portfolioId: portfolioId,
          stockId: stockId,
        })),
      });

      return portfolio;
    }),
  remove: privateProcedure
    .input(ModifyPortfolioSchema)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { portfolioId, stockIds } = input;

      let portfolio = await db.portfolio.findFirst({
        select: { id: true },
        where: {
          id: portfolioId,
          creatorId: user?.id ?? undefined,
        },
      });

      if (!portfolio) throw new TRPCError({ code: "NOT_FOUND" });

      await db.stockInPortfolio.deleteMany({
        where: {
          portfolioId: portfolioId,
          stockId: { in: stockIds },
        },
      });

      return portfolio;
    }),
  delete: privateProcedure
    .input(
      z.object({
        portfolioId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { portfolioId } = input;

      let portfolio = await db.portfolio.findFirst({
        select: { id: true },
        where: {
          id: portfolioId,
          creatorId: user?.id ?? undefined,
        },
      });

      if (!portfolio) throw new TRPCError({ code: "NOT_FOUND" });

      await db.portfolio.delete({
        where: { id: portfolioId },
      });

      return portfolio;
    }),
});
