import { db } from "@/lib/db";
import { transporter } from "@/lib/mail";
import {
  BadRequestResponse,
  InternalServerErrorResponse,
} from "@/lib/response";
import { UserVerifyMailSchema } from "@/lib/validators/user";
import { z } from "zod";
import bcryptjs from "bcryptjs";
import { getAuthSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new BadRequestResponse();

    const { email, userId } = UserVerifyMailSchema.parse(await req.json());

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
      subject: "Verify your email",
      html: "Verify your email here",
    };

    await transporter.sendMail(mailOptions);

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError)
      return new BadRequestResponse(error.message);

    return new InternalServerErrorResponse();
  }
}
