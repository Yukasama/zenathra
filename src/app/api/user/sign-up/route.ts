import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { z } from "zod";
import {
  BadRequestResponse,
  ConflictResponse,
  InternalServerErrorResponse,
  UnprocessableEntityResponse,
} from "@/lib/response";
import { UserSignUpSchema } from "@/lib/validators/user";
import bcryptjs from "bcryptjs";
import { transporter } from "@/lib/mail";
import { env } from "@/env.mjs";
import { tokenConfig } from "@/config/token";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (session) return new ConflictResponse("User is already logged in");

    const { email, password } = UserSignUpSchema.parse(await req.json());

    const existingUser = await db.user.findFirst({
      select: { id: true },
      where: { email },
    });

    if (existingUser)
      return new UnprocessableEntityResponse("Email is already registered");

    // Hash password 12 times
    const hashedPassword = await bcryptjs.hash(password, 12);

    const createdUser = await db.user.create({
      data: {
        email,
        hashedPassword,
      },
    });

    // Use the hashed user id as the verify token
    const hashedToken = await bcryptjs.hash(createdUser.id.toString(), 10);

    await db.user.update({
      where: { id: createdUser.id },
      data: {
        verifyToken: hashedToken,
        verifyTokenExpiry: new Date(Date.now() + tokenConfig.verifyTokenExpiry),
      },
    });

    const mailOptions = {
      from: "daszehntefragezeichen@gmail.com",
      to: email,
      subject: "Verify your email",
      html: `Verify your email here: ${env.NEXT_PUBLIC_VERCEL_URL}verify-email?token=${hashedToken}`,
    };

    await transporter.sendMail(mailOptions);

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError)
      return new BadRequestResponse(error.message);

    return new InternalServerErrorResponse();
  }
}
