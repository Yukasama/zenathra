import "server-only";

import { env } from "@/env.mjs";
import { Resend } from "resend";

const resend = new Resend(env.EMAIL_SERVER_PASSWORD);

interface MailOptions {
  to: string | string[] | undefined;
  type: "verify" | "forgotPassword";
  token: string;
}

export const sendMail = async ({ to, type, token }: MailOptions) => {
  if (!to) throw new Error("No email provided");

  await resend.emails.send({
    from: env.EMAIL_FROM,
    to: Array.isArray(to) ? to : [to],
    subject: type === "verify" ? "Verify your email" : "Reset your password",
    text:
      type === "verify"
        ? `Verify your email here: ${env.NEXT_PUBLIC_VERCEL_URL}/verify-email?token=${token}`
        : `Reset your password here: ${env.NEXT_PUBLIC_VERCEL_URL}/reset-password?token=${token}`,
    headers: {
      "X-Entity-Ref-ID": "123456789",
    },
    tags: [
      {
        name: "category",
        value: type === "verify" ? "verify_email" : "reset_password",
      },
    ],
  });
};
