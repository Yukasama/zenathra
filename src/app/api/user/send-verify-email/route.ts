import { createToken, db } from "@/lib/db";
import { transporter } from "@/lib/mail";
import {
  BadRequestResponse,
  InternalServerErrorResponse,
  UnauthorizedResponse,
} from "@/lib/response";
import { z } from "zod";
import { getAuthSession } from "@/lib/auth";
import { env } from "@/env.mjs";
import { tokenConfig } from "@/config/token";

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new UnauthorizedResponse();

    const hashedToken = await createToken();

    await db.user.update({
      where: { email: session.user.email! },
      data: {
        verifyToken: hashedToken,
        verifyTokenExpiry: new Date(Date.now() + tokenConfig.verifyTokenExpiry),
      },
    });

    const mailOptions = {
      from: env.SMTP_MAIL,
      to: session.user.email!,
      subject: "Verify your email",
      html: `Verify your email here: ${env.NEXT_PUBLIC_VERCEL_URL}/verify-email?token=${hashedToken}`,
    };

    await transporter.sendMail(mailOptions);

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError)
      return new BadRequestResponse(error.message);

    return new InternalServerErrorResponse();
  }
}
