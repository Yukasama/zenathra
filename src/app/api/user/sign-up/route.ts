import bcrypt from "bcrypt";
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

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (session) return new ConflictResponse("User is already logged in");

    const { email, password } = UserSignUpSchema.parse(await req.json());

    const existingUser = await db.user.findFirst({ where: { email } });
    if (existingUser)
      return new UnprocessableEntityResponse("Email is already registered");

    const hashedPassword = await bcrypt.hash(password, 12);

    await db.user.create({
      data: {
        email,
        hashedPassword,
      },
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError)
      return new BadRequestResponse(error.message);

    return new InternalServerErrorResponse();
  }
}
