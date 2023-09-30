import { router } from "./trpc";
import { portfolioRouter } from "./routers/portfolio";
import { userRouter } from "./routers/user";

export const appRouter = router({
  portfolio: portfolioRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
