import { db } from "@/lib/db";
import { transporter } from "@/lib/mail";
import {
  InternalServerErrorResponse,
  UnprocessableEntityResponse,
} from "@/lib/response";
import { UserMailSchema } from "@/lib/validators/user";
import { z } from "zod";
import { tokenConfig } from "@/config/token";
import { env } from "@/env.mjs";
import { createToken } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email } = UserMailSchema.parse(await req.json());

    const hashToken = await createToken();

    await db.user.update({
      where: { email: email },
      data: {
        forgotPasswordToken: hashToken,
        forgotPasswordExpiry: new Date(
          Date.now() + tokenConfig.forgotPasswordExpiry
        ),
      },
    });

    const mailOptions = {
      from: env.SMTP_MAIL,
      to: email,
      subject: "Reset your password",
      html: `Reset your password here: ${env.NEXT_PUBLIC_VERCEL_URL}/reset-password?token=${hashToken}`,
    };

    await transporter.sendMail(mailOptions);

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError)
      return new UnprocessableEntityResponse(error.message);

    return new InternalServerErrorResponse();
  }
}
