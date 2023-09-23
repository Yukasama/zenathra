import { NextAuthOptions, getServerSession } from "next-auth";
import Facebook from "next-auth/providers/facebook";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@/lib/db";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import EmailProvider from "next-auth/providers/email";
import { site } from "@/config/site";
import { env } from "@/env.mjs";
import Google from "next-auth/providers/google";
import { nanoid } from "nanoid";
import { redirect } from "next/navigation";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Facebook({
      clientId: env.FACEBOOK_APP_ID,
      clientSecret: env.FACEBOOK_APP_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHub({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password)
          throw new Error("Invalid email or password");

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user?.hashedPassword)
          throw new Error("Invalid email or password");

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );
        if (!isCorrectPassword) throw new Error("Invalid email or password");

        return user;
      },
    }),
    // EmailProvider({
    //   from: config.postmark.smtpFrom,
    //   sendVerificationRequest: async ({ identifier, url, provider }) => {
    //     const user = await db.user.findUnique({
    //       where: {
    //         email: identifier,
    //       },
    //       select: {
    //         emailVerified: true,
    //       },
    //     });

    //     const templateId = user?.emailVerified
    //       ? config.postmark.signinTemplate
    //       : config.postmark.activationTemplate;
    //     if (!templateId) {
    //       throw new Error("Missing template id");
    //     }

    //     const result = await postmarkClient.sendEmailWithTemplate({
    //       TemplateId: parseInt(templateId),
    //       To: identifier,
    //       From: provider.from as string,
    //       TemplateModel: {
    //         action_url: url,
    //         product_name: site.name,
    //       },
    //       Headers: [
    //         {
    //           Name: "X-Entity-Ref-ID",
    //           Value: new Date().getTime() + "",
    //         },
    //       ],
    //     });

    //     if (result.ErrorCode) {
    //       throw new Error(result.Message);
    //     }
    //   },
    // }),
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
};

export const getAuthSession = async () => await getServerSession(authOptions);

export const checkAuth = async () => {
  const session = await getAuthSession();
  if (!session) redirect("/sign-in");
};
