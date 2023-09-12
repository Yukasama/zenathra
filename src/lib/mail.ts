import "server-only";

import nodemailer from "nodemailer";
import { env } from "@/env.mjs";
import bcryptjs from "bcryptjs";
import { db } from "./db";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: true,
  auth: {
    user: env.MAILTRAP_USER,
    pass: env.MAILTRAP_PASSWORD,
  },
});

export async function sendMail(
  email: string,
  emailType: "VERFIY" | "RESET",
  userId: string | undefined
) {
  try {
    if (!userId) throw new Error("No user id");

    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    await db.user.update({
      where: { id: userId },
      data: {
        verifyToken: hashedToken,
        verifyTokenExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });

    const mailOptions = {
      from: "daszehntefragezeichen@gmail.com",
      to: email,
      subject:
        emailType === "VERFIY" ? "Verify your email" : "Reset your password",
      text:
        emailType === "VERFIY"
          ? "Verify your email here"
          : "Reset your password here",
      html:
        emailType === "VERFIY"
          ? "Verify your email here"
          : "Reset your password here",
    };

    await transporter.sendMail(mailOptions);
  } catch {}
}
