import { User as PrismaUser } from "@prisma/client";

export type User = Omit<
  PrismaUser,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};
