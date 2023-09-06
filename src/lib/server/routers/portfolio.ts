import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { db } from "@/lib/db";

export const portfolioRouter = router({
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
