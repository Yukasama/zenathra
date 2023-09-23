import "server-only";

import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

declare global {
  // eslint-disable-next-line no-var, no-unused-vars
  var cachedPrisma: PrismaClient;
}

let prisma: PrismaClient;
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient();
  }
  prisma = global.cachedPrisma;
}

export const db = prisma;

export async function createToken() {
  const token = crypto.randomUUID();
  return await bcryptjs.hash(token, 10);
}