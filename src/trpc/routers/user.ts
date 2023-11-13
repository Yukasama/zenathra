import { privateProcedure, publicProcedure, router } from "../trpc";
import { absoluteUrl } from "@/lib/utils";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { getUserSubscriptionPlan, stripe } from "@/lib/stripe";
import { PLANS } from "@/config/stripe";
import {
  CreateUserSchema,
  ResetPasswordSchema,
  UserUpdateSchema,
} from "@/lib/validators/user";
import { z } from "zod";
import { createToken } from "@/lib/create-token";
import { getUser } from "@/lib/auth";
import { tokenConfig } from "@/config/token";
import { sendMail } from "@/lib/mail";

export const userRouter = router({
  authCallback: publicProcedure.query(async () => {
    const user = await getUser();

    if (!user?.id || !user?.email)
      throw new TRPCError({ code: "UNAUTHORIZED" });

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
  createStripeSession: privateProcedure.mutation(async ({ ctx }) => {
    const { userId } = ctx;

    const dbUser = await db.user.findFirst({
      select: {
        id: true,
        stripeCustomerId: true,
      },
      where: { id: userId },
    });

    if (!dbUser) throw new TRPCError({ code: "UNAUTHORIZED" });

    const billingUrl = absoluteUrl("/dashboard/billing");
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
  create: publicProcedure
    .input(CreateUserSchema)
    .mutation(async ({ input }) => {
      const existingUser = await db.user.findFirst({
        select: { id: true },
        where: { email: input.email },
      });

      if (existingUser) {
        throw new TRPCError({ code: "CONFLICT" });
      }

      const [hashedPassword, hashedToken] = await Promise.all([
        bcryptjs.hash(input.password, 12),
        createToken(),
      ]);

      await Promise.all([
        db.user.create({
          data: {
            email: input.email,
            hashedPassword,
          },
        }),
        db.verificationToken.create({
          data: {
            token: hashedToken,
            identifier: input.email,
            expires: new Date(Date.now() + tokenConfig.verifyTokenExpiry),
            type: "verify",
          },
        }),
        sendMail({
          to: input.email,
          type: "verify",
          token: hashedToken,
        }),
      ]);
    }),
  update: privateProcedure
    .input(UserUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      await db.user.update({
        where: { id: userId },
        data: {
          ...(input.username !== undefined && { username: input.username }),
          ...(input.email !== undefined && { email: input.email }),
          ...(input.biography !== undefined && { biography: input.biography }),
        },
      });
    }),
  delete: privateProcedure.mutation(async ({ ctx }) => {
    const { userId } = ctx;

    await db.user.delete({
      where: { id: userId },
    });
  }),
  resetPassword: privateProcedure
    .input(ResetPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;

      const verificationToken = await db.verificationToken.findFirst({
        select: { token: true },
        where: {
          identifier: user.email ?? undefined,
          expires: { gte: new Date() },
          type: "forgotPassword",
        },
      });

      if (
        !verificationToken ||
        !bcryptjs.compareSync(input.token, verificationToken.token)
      ) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const hashedPassword = await bcryptjs.hash(input.password, 12);

      await Promise.all([
        db.user.update({
          where: { id: user.id },
          data: { hashedPassword },
        }),
        db.verificationToken.delete({
          where: { token: verificationToken.token },
        }),
      ]);
    }),
  verify: publicProcedure
    .input(z.string()) // Verify Token
    .mutation(async ({ input }) => {
      const verificationToken = await db.verificationToken.findFirst({
        select: { token: true, identifier: true },
        where: {
          token: input,
          expires: { gte: new Date() },
          type: "verify",
        },
      });

      if (
        !verificationToken ||
        !bcryptjs.compareSync(input, verificationToken.token)
      )
        throw new TRPCError({ code: "NOT_FOUND" });

      await Promise.all([
        db.user.update({
          where: { email: verificationToken.identifier },
          data: { emailVerified: new Date() },
        }),
        db.verificationToken.delete({
          where: { token: verificationToken.token },
        }),
      ]);
    }),
  sendResetPassword: publicProcedure
    .input(z.string().email()) // Email where to send reset password link
    .mutation(async ({ input }) => {
      const hashToken = await createToken();

      await db.verificationToken.create({
        data: {
          token: hashToken,
          identifier: input,
          expires: new Date(Date.now() + tokenConfig.verifyTokenExpiry),
          type: "forgotPassword",
        },
      });

      await sendMail({
        to: input,
        type: "forgotPassword",
        token: hashToken,
      });
    }),
  sendVerification: privateProcedure.mutation(async ({ ctx }) => {
    const { user } = ctx;
    const hashedToken = await createToken();

    if (!user.email) throw new TRPCError({ code: "BAD_REQUEST" });

    db.verificationToken.create({
      data: {
        token: hashedToken,
        identifier: user.email,
        expires: new Date(Date.now() + tokenConfig.verifyTokenExpiry),
        type: "verify",
      },
    });

    await sendMail({
      to: user.email ?? undefined,
      type: "verify",
      token: hashedToken,
    });
  }),
});
