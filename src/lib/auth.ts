import NextAuth, { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/db";
// import Email from "next-auth/providers/email";
// import { env } from "@/env.mjs";

export const authConfig = {
  adapter: PrismaAdapter(db),
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    Google,
    Facebook,
    GitHub,
    // Email({
    //   server: {
    //     host: env.EMAIL_SERVER_HOST,
    //     port: Number(env.EMAIL_SERVER_PORT),
    //     auth: {
    //       user: env.EMAIL_SERVER_USER,
    //       pass: env.EMAIL_SERVER_PASSWORD,
    //     },
    //   },
    //   from: env.EMAIL_FROM,
    // }),
  ],
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
    async redirect({ baseUrl }) {
      return baseUrl;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signOut } = NextAuth(authConfig);

export async function getUser() {
  const session = await auth();
  return session?.user;
}
