import NextAuth, { NextAuthOptions, getServerSession } from "next-auth";
import Facebook from "next-auth/providers/facebook";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/db";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
// import EmailProvider from "next-auth/providers/email";
import { env } from "@/env.mjs";
import Google from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  providers: [
    Google({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    }),
    Facebook({
      clientId: env.AUTH_FACEBOOK_ID,
      clientSecret: env.AUTH_FACEBOOK_SECRET,
    }),
    GitHub({
      clientId: env.AUTH_GITHUB_ID,
      clientSecret: env.AUTH_GITHUB_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password)
          throw new Error("Invalid email or password");

        const user = await db.user.findFirst({
          where: { email: credentials.email },
        });

        if (!user || !user?.hashedPassword)
          throw new Error("Invalid email or password.");

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassword) throw new Error("Invalid email or password.");

        return user;
      },
    }),
    // EmailProvider({
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
    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          username: true,
        },
        where: { email: token.email },
      });

      if (!dbUser) {
        token.id = user.id;
        return token;
      }

      return dbUser;
    },
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
    redirect() {
      return "/";
    },
  },
};

export default NextAuth(authOptions);

export async function getUser() {
  const session = await getServerSession();
  return session?.user;
}
