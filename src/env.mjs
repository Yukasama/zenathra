import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_VERCEL_URL: z.string().url(),
  },
  server: {
    DATABASE_URL: z.string().url(),
    ACCELERATE_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    KINDE_CLIENT_ID: z.string(),
    KINDE_CLIENT_SECRET: z.string(),
    KINDE_ISSUER_URL: z.string(),
    KINDE_SITE_URL: z.string(),
    KINDE_POST_LOGOUT_REDIRECT_URL: z.string(),
    KINDE_POST_LOGIN_REDIRECT_URL: z.string(),
    KINDE_AUDIENCE: z.string(),
    STRIPE_API_KEY: z.string(),
    STRIPE_WEBHOOK_SECRET: z.string(),
    FMP_API_KEY: z.string(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    ACCELERATE_URL: process.env.ACCELERATE_URL,
    NODE_ENV: process.env.NODE_ENV,
    KINDE_CLIENT_ID: process.env.KINDE_CLIENT_ID,
    KINDE_CLIENT_SECRET: process.env.KINDE_CLIENT_SECRET,
    KINDE_ISSUER_URL: process.env.KINDE_ISSUER_URL,
    KINDE_SITE_URL: process.env.KINDE_SITE_URL,
    KINDE_POST_LOGOUT_REDIRECT_URL: process.env.KINDE_POST_LOGOUT_REDIRECT_URL,
    KINDE_POST_LOGIN_REDIRECT_URL: process.env.KINDE_POST_LOGIN_REDIRECT_URL,
    KINDE_AUDIENCE: process.env.KINDE_AUDIENCE,
    STRIPE_API_KEY: process.env.STRIPE_API_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    FMP_API_KEY: process.env.FMP_API_KEY,
  },
});
