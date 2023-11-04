import {
  KindeUser,
  createKindeManagementAPIClient,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { privateProcedure, publicProcedure, router } from "../trpc";
import { absoluteUrl } from "@/lib/utils";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { getUserSubscriptionPlan, stripe } from "@/lib/stripe";
import { PLANS } from "@/config/stripe";
import { CreateUserSchema, UserUpdateSchema } from "@/lib/validators/user";
import { z } from "zod";
import { createToken } from "@/lib/create-token";

export const userRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user.id || !user.email) throw new TRPCError({ code: "UNAUTHORIZED" });

    const dbUser = await db.user.findFirst({
      select: { id: true },
      where: { id: user.id },
    });

    if (!dbUser)
      await db.user.create({
        data: {
          id: user.id,
          email: user.email,
        },
      });

    return { success: true };
  }),
  getKindeSession: privateProcedure.query(async () => {
    const { getUser, isAuthenticated, getPermissions, getOrganization } =
      getKindeServerSession();
    const user = await getUser();
    const authenticated = isAuthenticated();
    const permissions = getPermissions();
    const organization = getOrganization();

    return { user, authenticated, permissions, organization };
  }),
  createStripeSession: privateProcedure.mutation(async ({ ctx }) => {
    const { userId } = ctx;

    const billingUrl = absoluteUrl("/dashboard/billing");

    if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

    const dbUser = await db.user.findFirst({
      select: {
        id: true,
        stripeCustomerId: true,
      },
      where: { id: userId },
    });

    if (!dbUser) throw new TRPCError({ code: "UNAUTHORIZED" });

    const subscriptionPlan = await getUserSubscriptionPlan();

    if (subscriptionPlan.isSubscribed && dbUser.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: dbUser.stripeCustomerId,
        return_url: billingUrl,
      });

      return { url: stripeSession.url };
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: billingUrl,
      cancel_url: billingUrl,
      payment_method_types: ["card", "paypal"],
      mode: "subscription",
      billing_address_collection: "auto",
      line_items: [
        {
          price: PLANS.find((plan) => plan.name === "Pro")?.price.priceIds.test,
          quantity: 1,
        },
      ],
      metadata: { userId: userId },
    });

    return { url: stripeSession.url };
  }),
  getbyId: publicProcedure.input(z.string()).query(async ({ input }) => {
    const client = await createKindeManagementAPIClient();

    const user = await client.usersApi.getUserData({ id: input });

    if (!user) throw new TRPCError({ code: "NOT_FOUND" });

    return {
      given_name: user.firstName ?? null,
      family_name: user.lastName ?? null,
      picture: user.picture ?? null,
    } as Pick<KindeUser, "given_name" | "family_name" | "picture">;
  }),
  create: publicProcedure
    .input(CreateUserSchema)
    .mutation(async ({ input }) => {
      const existingUser = await db.user.findFirst({
        select: { id: true },
        where: { input.email },
      });

      if (existingUser) return new TRPCError({ code: "ALREADY_EXISTS" });

    // Hash password 12 times
    const hashedPassword = await bcryptjs.hash(password, 12);
    const hashedToken = await createToken();

    const createdUser = await db.user.create({
      data: {
        email,
        hashedPassword,
        verifyToken: hashedToken,
        verifyTokenExpiry: new Date(Date.now() + tokenConfig.verifyTokenExpiry),
      },
    });

    const mailOptions = {
      from: env.SMTP_MAIL,
      to: email,
      subject: "Verify your email",
      html: `Verify your email here: ${env.NEXT_PUBLIC_VERCEL_URL}/verify-email?token=${hashedToken}`,
    };

    await transporter.sendMail(mailOptions);
    }),
  update: privateProcedure
    .input(UserUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const dbUser = await db.user.findFirst({
        select: { id: true },
        where: { id: userId },
      });

      if (!dbUser) throw new TRPCError({ code: "UNAUTHORIZED" });

      const client = await createKindeManagementAPIClient();

      // Running sequential because both operations are required to be successful
      client.usersApi.updateUser({
        id: userId,
        updateUserRequest: {
          givenName: input.givenName,
          familyName: input.familyName,
        },
      });

      db.user.update({
        where: { id: userId },
        data: { biography: input.biography },
      });
    }),
  delete: privateProcedure.mutation(async ({ ctx }) => {
    const { userId } = ctx;

    if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

    const client = await createKindeManagementAPIClient();

    await Promise.all([
      client.usersApi.deleteUser({ id: userId }),
      db.user.delete({
        where: { id: userId },
      }),
    ]);
  }),
  resetPassword: privateProcedure
    .input(
      z.object({
        password: z.string().min(11),
        token: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const user = await db.user.findFirst({
        select: { id: true },
        where: {
          forgotPasswordToken: input.token,
          forgotPasswordExpiry: { gte: new Date() },
        },
      });

      if (!user) return new TRPCError({ code: "NOT_FOUND" });

      const hashedPassword = await bcryptjs.hash(input.password, 12);

      await db.user.update({
        where: { id: user.id },
        data: {
          hashedPassword,
          forgotPasswordToken: null,
          forgotPasswordExpiry: null,
        },
      });
    }),
  verifyMail: publicProcedure
    .input(
      z.object({
        token: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const user = await db.user.findFirst({
        select: { id: true },
        where: {
          verifyToken: input.token,
          verifyTokenExpiry: { gte: new Date() },
        },
      });

      if (!user) return new TRPCError({ code: "NOT_FOUND" });

      await db.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
          verifyToken: null,
          verifyTokenExpiry: null,
        },
      });
    }),
  sendResetPassword: publicProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const hashToken = await createToken();

      await db.user.update({
        where: { email: input },
        data: {
          forgotPasswordToken: hashToken,
          forgotPasswordExpiry: new Date(
            Date.now() + tokenConfig.forgotPasswordExpiry
          ),
        },
      });

      const mailOptions = {
        from: env.SMTP_MAIL,
        to: email,
        subject: "Reset your password",
        html: `Reset your password here: ${env.NEXT_PUBLIC_VERCEL_URL}/reset-password?token=${hashToken}`,
      };

      await transporter.sendMail(mailOptions);
    }),
  sendVerifyEmail: privateProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const hashToken = await createToken();

      await db.user.update({
        where: { email: session.user.email! },
        data: {
          verifyToken: hashedToken,
          verifyTokenExpiry: new Date(
            Date.now() + tokenConfig.verifyTokenExpiry
          ),
        },
      });

      const mailOptions = {
        from: env.SMTP_MAIL,
        to: session.user.email!,
        subject: "Verify your email",
        html: `Verify your email here: ${env.NEXT_PUBLIC_VERCEL_URL}/verify-email?token=${hashedToken}`,
      };

      await transporter.sendMail(mailOptions);
    }),
});
