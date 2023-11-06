import NextAuth from "next-auth";
import Facebook from "next-auth/providers/facebook";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/db";
import Credentials from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import EmailProvider from "next-auth/providers/email";
import { SITE } from "@/config/site";
import { env } from "@/env.mjs";
import Google from "next-auth/providers/google";
import { nanoid } from "nanoid";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  providers: [
    Google({ allowDangerousEmailAccountLinking: true }),
    Facebook({ allowDangerousEmailAccountLinking: true }),
    GitHub({ allowDangerousEmailAccountLinking: true }),
    Credentials({
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize({ email, password }) {
        if (!email || !password) throw new Error("Invalid email or password");

        const user = await db.user.findFirst({
          where: { email },
        });

        if (!user || !user?.hashedPassword)
          throw new Error("Invalid email or password.");

        const isCorrectPassword = await bcryptjs.compare(
          password,
          user.hashedPassword
        );

        if (!isCorrectPassword) throw new Error("Invalid email or password.");

        return user;
      },
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.username = token.username;
      }
      return session;
    },
    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        where: { email: token.email },
      });

      if (!dbUser) {
        token.id = user!.id;
        return token;
      }

      if (!dbUser.username)
        await db.user.update({
          where: { id: dbUser.id },
          data: { username: nanoid(10) },
        });

      return dbUser;
    },
    redirect() {
      return "/";
    },
  },
});

export async function getUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}
