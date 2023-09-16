import {
  InternalServerErrorResponse,
  NotFoundResponse,
  UnprocessableEntityResponse,
} from "@/lib/response";
import { z } from "zod";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import bcryptjs from "bcryptjs";
import { UserUpdatePasswordSchema } from "@/lib/validators/user";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    const { password, token } = UserUpdatePasswordSchema.parse(
      await req.json()
    );

    const user = await db.user.findFirst({
      select: { id: true },
      where: {
        forgotPasswordToken: token,
        forgotPasswordExpiry: { gte: new Date() },
      },
    });

    if (!user) return new NotFoundResponse();

    const hashedPassword = await bcryptjs.hash(password, 12);

    await db.user.update({
      where: { id: session?.user.id },
      data: {
        hashedPassword,
        forgotPasswordToken: null,
        forgotPasswordExpiry: null,
      },
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError)
      return new UnprocessableEntityResponse(error.message);

    return new InternalServerErrorResponse();
  }
}
