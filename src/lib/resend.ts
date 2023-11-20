import "server-only";

import { env } from "@/env.mjs";
import { Resend } from "resend";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

interface MailOptions {
  to: string | string[] | undefined;
  token: string;
}

const resend = new Resend(env.EMAIL_SERVER_PASSWORD);

export const sendMail = async ({ to, token }: MailOptions) => {
  if (!to) {
    throw new Error("No email provided.");
  }

  await resend.emails.send({
    from: env.EMAIL_FROM,
    to: Array.isArray(to) ? to : [to],
    subject: "Verify your email",
    text: `Verify your email here: ${process.env.VERCEL_URL}/verify-email?token=${token}`,
    headers: {
      "X-Entity-Ref-ID": `${to}-${Date.now()}`,
    },
    tags: [
      {
        name: "category",
        value: "verify_email",
      },
    ],
  });
};

export async function createToken() {
  const token = randomUUID();
  return await bcrypt.hash(token, 10);
}
