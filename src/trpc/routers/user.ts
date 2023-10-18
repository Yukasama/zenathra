import {
  createKindeManagementAPIClient,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { privateProcedure, publicProcedure, router } from "../trpc";
import { absoluteUrl } from "@/lib/utils";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { getUserSubscriptionPlan, stripe } from "@/lib/stripe";
import { PLANS } from "@/config/stripe";
import { UserUpdateSchema } from "@/lib/validators/user";
import { z } from "zod";

export const userRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = getUser();

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
  getKindeSession: publicProcedure.query(async () => {
    const { getUser, isAuthenticated, getPermissions, getOrganization } =
      getKindeServerSession();
    const user = getUser();
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
  get: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const client = await createKindeManagementAPIClient();

      const user = await client.usersApi.getUserData({ id: input.id });

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      return {
        given_name: user.firstName ?? null,
        family_name: user.lastName ?? null,
        picture: user.picture ?? null,
      };
    }),
  update: privateProcedure
    .input(UserUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      const dbUser = await db.user.findFirst({
        select: { id: true },
        where: { id: userId },
      });

      if (!dbUser) throw new TRPCError({ code: "UNAUTHORIZED" });

      const client = await createKindeManagementAPIClient();

      // Running sequential because both requests are required to be successful
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
});
