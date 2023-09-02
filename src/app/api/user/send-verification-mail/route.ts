import { env } from "@/env.mjs";
import { InternalServerErrorResponse, UnprocessableEntityResponse } from "@/lib/response";
import { UserSendMailSchema } from "@/lib/validators/user";
import nodemailer from "nodemailer";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const { email, subject, message } = UserSendMailSchema.parse(await req.json());

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

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError)
      return new UnprocessableEntityResponse(error.message);

    return new InternalServerErrorResponse();
  }
}
