import { db } from "@/lib/db";
import { transporter } from "@/lib/mail";
import {
  BadRequestResponse,
  InternalServerErrorResponse,
} from "@/lib/response";
import { UserMailSchema } from "@/lib/validators/user";
import { z } from "zod";
import bcryptjs from "bcryptjs";
import { tokenConfig } from "@/config/token";
import { env } from "@/env.mjs";

export async function POST(req: Request) {
  try {
    const { email, userId } = UserMailSchema.parse(await req.json());

    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    await db.user.update({
      where: { id: userId },
      data: {
        forgotPasswordToken: hashedToken,
        forgotPasswordExpiry: new Date(
          Date.now() + tokenConfig.forgotPasswordExpiry
        ),
      },
    });

    const mailOptions = {
      from: "daszehntefragezeichen@gmail.com",
      to: email,
      subject: "Reset your password",
      html: `Reset your password here: ${env.NEXT_PUBLIC_VERCEL_URL}reset-password?token=${hashedToken}`,
    };

    await transporter.sendMail(mailOptions);

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError)
      return new BadRequestResponse(error.message);

    return new InternalServerErrorResponse();
  }
}
