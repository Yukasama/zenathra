import { privateProcedure, router } from "../trpc";
import { absoluteUrl } from "@/lib/utils";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { getUserSubscriptionPlan, stripe } from "@/lib/stripe";
import { PLANS } from "@/config/stripe";
import { UserUpdateSchema } from "@/lib/validators/user";
// import { z } from "zod";
// import { createToken } from "@/lib/create-token";
// import { tokenConfig } from "@/config/token";
// import { sendMail } from "@/lib/resend";
// import bcrypt from "bcryptjs";

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
  // verify: publicProcedure
  //   .input(z.string())
  //   .mutation(async ({ input: verifyToken }) => {
  //     const verificationToken = await db.verificationToken.findFirst({
  //       select: { token: true, identifier: true },
  //       where: {
  //         token: verifyToken,
  //         expires: { gte: new Date() },
  //       },
  //     });

  //     if (
  //       !verificationToken ||
  //       !bcrypt.compareSync(verifyToken, verificationToken.token)
  //     )
  //       throw new TRPCError({ code: "NOT_FOUND" });

  //     await Promise.all([
  //       db.user.update({
  //         where: { email: verificationToken.identifier },
  //         data: { emailVerified: new Date() },
  //       }),
  //       db.verificationToken.delete({
  //         where: { token: verificationToken.token },
  //       }),
  //     ]);
  //   }),
  // sendVerification: privateProcedure.mutation(async ({ ctx }) => {
  //   const { user } = ctx;

  //   if (!ctx.user.email) {
  //     throw new TRPCError({ code: "BAD_REQUEST" });
  //   }

  //   const hashedToken = await createToken();
  //   await db.verificationToken.create({
  //     data: {
  //       token: hashedToken,
  //       identifier: ctx.user.email,
  //       expires: new Date(Date.now() + tokenConfig.verifyTokenExpiry),
  //     },
  //   });

  //   await sendMail({
  //     to: ctx.user.email ?? undefined,
  //     token: hashedToken,
  //   });
  // }),
});
