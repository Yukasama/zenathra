import { db } from "@/lib/db";
import z from "zod";
import bcrypt from "bcryptjs";
import { getAuthSession } from "@/lib/auth";
import {
  ConflictResponse,
  ForbiddenResponse,
  InternalServerErrorResponse,
  UnauthorizedResponse,
  UnprocessableEntityResponse,
} from "@/lib/response";
import { UserUpdatePasswordSchema } from "@/lib/validators/user";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new UnauthorizedResponse();

    const user = await db.user.findFirst({
      where: {
        id: session.user.id,
      },
    });

    if (!user) return new UnauthorizedResponse();

    const accounts = await db.account.findMany({
      where: {
        userId: user.id,
      },
    });

    if (accounts.length > 0)
      throw new ConflictResponse(
        "Change not possible since you have multiple linked accounts to your mail"
      );

    const { oldPassword, password } = UserUpdatePasswordSchema.parse(
      await req.json()
    );

    if (!(await bcrypt.compare(oldPassword, user.hashedPassword)))
      return new ForbiddenResponse("Old password is incorrect");

    const hashedPassword = await bcrypt.hash(password, 12);

    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        hashedPassword: hashedPassword,
      },
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError)
      return new UnprocessableEntityResponse(error.message);

    return new InternalServerErrorResponse();
  }
}
