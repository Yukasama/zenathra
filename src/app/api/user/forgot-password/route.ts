import {
  InternalServerErrorResponse,
  NotFoundResponse,
  UnauthorizedResponse,
  UnprocessableEntityResponse,
} from "@/lib/response";
import { z } from "zod";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import bcryptjs from "bcryptjs";

const Schema = z.object({
  password: z.string().min(11, "Password must be atleast 11 characters."),
  token: z.string().nonempty(),
});

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (session?.user) return new UnauthorizedResponse();

    const { password, token } = Schema.parse(await req.json());

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
