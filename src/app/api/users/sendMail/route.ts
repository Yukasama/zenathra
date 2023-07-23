import { env } from "@/env.mjs";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

const Schema = z.object({
  email: z.string().email(),
  subject: z.string().nonempty(),
  message: z.string().nonempty(),
});

export async function POST(req: NextRequest) {
  try {
    const { email, subject, message } = Schema.parse(await req.json());

    const mail = {
      from: env.GMAIL_EMAIL_ADDRESS,
      to: email,
      subject: subject,
      text: message,
      html: `<p>${message}</p>`,
    };

    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    await transporter.sendMail(mail);

    return NextResponse.json({ message: "Email sent." });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: err.status || 500 }
    );
  }
}
