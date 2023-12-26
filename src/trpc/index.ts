import { router } from "./trpc";
import { portfolioRouter } from "./routers/portfolio";
import { userRouter } from "./routers/user";
import { stockRouter } from "./routers/stock";
import { fmpRouter } from "./routers/fmp";

export const appRouter = router({
  fmp: fmpRouter,
  portfolio: portfolioRouter,
  stock: stockRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;

export const caller = appRouter.createCaller({});
