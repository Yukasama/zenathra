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
import { tokenConfig } from "@/config/token";
import { sendMail } from "@/lib/resend";
import bcryptjs from "bcryptjs";

export const userRouter = router({
  createStripeSession: privateProcedure.mutation(async ({ ctx }) => {
    const { user } = ctx;

    const dbUser = await db.user.findFirst({
      select: {
        id: true,
        stripeCustomerId: true,
      },
      where: { id: user.id },
    });

    if (!dbUser) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const billingUrl = absoluteUrl("/billing");
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
      metadata: { userId: ctx.user.id },
    });

    return { url: stripeSession.url };
  }),
  create: publicProcedure
    .input(CreateUserSchema)
    .mutation(async ({ input }) => {
      const { email, password } = input;

      const existingUser = await db.user.count({
        where: { email },
      });

      if (existingUser) {
        throw new TRPCError({ code: "CONFLICT" });
      }

      const [hashedPassword, hashedToken] = await Promise.all([
        bcryptjs.hash(password, 12),
        createToken(),
      ]);

      await Promise.all([
        db.user.create({
          data: {
            email,
            hashedPassword,
          },
        }),
        db.verificationToken.create({
          data: {
            token: hashedToken,
            identifier: input.email,
            expires: new Date(Date.now() + tokenConfig.verifyTokenExpiry),
          },
        }),
        sendMail({
          to: input.email,
          token: hashedToken,
        }),
      ]);
    }),
  update: privateProcedure
    .input(UserUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { username, biography } = input;

      await db.user.update({
        where: { id: user.id },
        data: {
          ...(username && { username }),
          ...(biography && { biography }),
        },
      });
    }),
  delete: privateProcedure.mutation(async ({ ctx }) => {
    const { user } = ctx;

    await db.user.delete({
      where: { id: user.id },
    });
  }),
  resetPassword: privateProcedure
    .input(ResetPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { password, token } = input;

      const verificationToken = await db.verificationToken.findFirst({
        select: { token: true },
        where: {
          identifier: user.email ?? undefined,
          expires: { gte: new Date() },
        },
      });

      const isTokenInvalid =
        !verificationToken ||
        !bcryptjs.compareSync(token, verificationToken.token);

      if (isTokenInvalid) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const hashedPassword = await bcryptjs.hash(password, 12);

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
  sendResetPassword: publicProcedure
    .input(z.string().email())
    .mutation(async ({ input: email }) => {
      const hashedToken = await createToken();

      await db.verificationToken.create({
        data: {
          token: hashedToken,
          identifier: email,
          expires: new Date(Date.now() + tokenConfig.verifyTokenExpiry),
        },
      });

      await sendMail({
        to: email,
        type: "forgotPassword",
        token: hashedToken,
      });
    }),
  verify: publicProcedure
    .input(z.string())
    .mutation(async ({ input: verifyToken }) => {
      const verificationToken = await db.verificationToken.findFirst({
        select: { token: true, identifier: true },
        where: {
          token: verifyToken,
          expires: { gte: new Date() },
        },
      });

      const isTokenInvalid =
        !verificationToken ||
        !bcryptjs.compareSync(verifyToken, verificationToken.token);

      if (isTokenInvalid) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

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
  sendVerification: privateProcedure.mutation(async ({ ctx }) => {
    const { user } = ctx;

    if (!user.email) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const hashedToken = await createToken();

    db.verificationToken.create({
      data: {
        token: hashedToken,
        identifier: user.email,
        expires: new Date(Date.now() + tokenConfig.verifyTokenExpiry),
      },
    });

    await sendMail({
      to: user.email ?? undefined,
      token: hashedToken,
    });
  }),
});
