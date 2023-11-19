import { db } from "@/db";
import { getUser } from "@/lib/auth";
import { TRPCError, initTRPC } from "@trpc/server";

const t = initTRPC.create();
const middleware = t.middleware;

const isAuth = middleware(async (opts) => {
  const user = await getUser();

  if (!user?.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return opts.next({ ctx: { user } });
});

const isAdmin = middleware(async (opts) => {
  const user = await getUser();

  const dbUser = await db.user.findFirst({
    select: { role: true },
    where: { id: user?.id },
  });

  if (!user?.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  if (dbUser?.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }

  return opts.next({ ctx: { user } });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);
export const adminProcedure = t.procedure.use(isAdmin);
