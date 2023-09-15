import { db } from "@/lib/db";
import { transporter } from "@/lib/mail";
import {
  BadRequestResponse,
  InternalServerErrorResponse,
  UnauthorizedResponse,
} from "@/lib/response";
import { UserMailSchema } from "@/lib/validators/user";
import { z } from "zod";
import bcryptjs from "bcryptjs";
import { getAuthSession } from "@/lib/auth";
import { env } from "@/env.mjs";
import { tokenConfig } from "@/config/token";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new UnauthorizedResponse();

    const { email, userId } = UserMailSchema.parse(await req.json());

    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    await db.user.update({
      where: { id: userId },
      data: {
        verifyToken: hashedToken,
        verifyTokenExpiry: new Date(Date.now() + tokenConfig.verifyTokenExpiry),
      },
    });

    const mailOptions = {
      from: "daszehntefragezeichen@gmail.com",
      to: email,
      subject: "Verify your email",
      html: `Verify your email here: ${env.VERCEL_URL}/verify-email?token=${hashedToken}`,
    };

    await transporter.sendMail(mailOptions);

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError)
      return new BadRequestResponse(error.message);

    return new InternalServerErrorResponse();
  }
}
