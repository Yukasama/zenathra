import {
  InternalServerErrorResponse,
  NotFoundResponse,
  UnauthorizedResponse,
  UnprocessableEntityResponse,
} from "@/lib/response";
import { z } from "zod";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

const Schema = z.object({
  token: z.string().nonempty(),
});

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new UnauthorizedResponse();

    const { token } = Schema.parse(await req.json());

    const user = await db.user.findFirst({
      select: { id: true },
      where: { verifyToken: token, verifyTokenExpiry: { gt: new Date() } },
    });

    if (!user) return new NotFoundResponse();

    await db.user.update({
      where: { id: session?.user.id },
      data: {
        emailVerified: new Date(),
        verifyToken: undefined,
        verifyTokenExpiry: undefined,
      },
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError)
      return new UnprocessableEntityResponse(error.message);

    return new InternalServerErrorResponse();
  }
}
