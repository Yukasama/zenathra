import { getAuthSession } from "@/lib/auth";
import { TRPCError, initTRPC } from "@trpc/server";
import { db } from "@/lib/db";

const t = initTRPC.create();

export const middleware = t.middleware;

export const router = t.router;

const isAuthorized = middleware(async (opts) => {
  const session = await getAuthSession();

  if (!session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });

  return opts.next({
    ctx: {
      user: session.user,
    },
  });
});

const isAdmin = middleware(async (opts) => {
  const session = await getAuthSession();

  if (!session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });

  const user = await db.user.findFirst({
    where: { id: session?.user.id },
  });

  if (user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });

  return opts.next({
    ctx: {
      user: user,
    },
  });
});

export const publicProcedure = t.procedure;
export const authorizedProcedure = t.procedure.use(isAuthorized);
export const adminProcedure = t.procedure.use(isAdmin);
