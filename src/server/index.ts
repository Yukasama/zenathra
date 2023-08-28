import { router } from "./trpc";
import { portfolioRouter } from "./routers/portfolio";

export const appRouter = router({
  portfolio: portfolioRouter,
});

export type AppRouter = typeof appRouter;
