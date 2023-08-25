import { db } from "@/lib/db";
import { publicProcedure, router } from "./trpc";
import { z } from "zod";
import { CreatePortfolioSchema } from "@/lib/validators/portfolio";

export const appRouter = router({
  getPortfolio: publicProcedure
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
  // createPortfolio: publicProcedure
  //   .input(CreatePortfolioSchema)
  //   .mutation(async ({ ctx, input }) => {
  //     const { user } = ctx;
  //     return await db.portfolio.create({
  //       data: {
  //         ...input,
  //         creatorId: user.id,
  //       },
  //     });
  //   }),
});

export type AppRouter = typeof appRouter;
