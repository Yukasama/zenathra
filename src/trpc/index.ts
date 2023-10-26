import { router } from "./trpc";
import { portfolioRouter } from "./routers/portfolio";
import { userRouter } from "./routers/user";
import { stockRouter } from "./routers/stock";
import { databaseRouter } from "./routers/database";

export const appRouter = router({
  database: databaseRouter,
  portfolio: portfolioRouter,
  stock: stockRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
