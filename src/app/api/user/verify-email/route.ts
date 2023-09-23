import {
  InternalServerErrorResponse,
  NotFoundResponse,
  UnprocessableEntityResponse,
} from "@/lib/response";
import { z } from "zod";
import { db } from "@/lib/db";

const VerifyMailSchema = z.object({
  token: z.string().nonempty(),
});

export async function POST(req: Request) {
  try {
    const { token } = VerifyMailSchema.parse(await req.json());

    const user = await db.user.findFirst({
      select: { id: true },
      where: { verifyToken: token, verifyTokenExpiry: { gte: new Date() } },
    });

    if (!user) return new NotFoundResponse();

    await db.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verifyToken: null,
        verifyTokenExpiry: null,
      },
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError)
      return new UnprocessableEntityResponse(error.message);

    return new InternalServerErrorResponse();
  }
}
