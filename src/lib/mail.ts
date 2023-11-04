import "server-only";

import { createTransport } from "nodemailer";
import { env } from "@/env.mjs";

export const transporter = createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT),
  auth: {
    user: env.MAILTRAP_USER,
    pass: env.MAILTRAP_PASSWORD,
  },
});