import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  ConflictResponse,
  InternalServerErrorResponse,
  UnauthorizedResponse,
  UnprocessableEntityResponse,
} from "@/lib/response";
import { UpdateUsernameSchema } from "@/lib/validators/user";
import z from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new UnauthorizedResponse();

    const { username } = UpdateUsernameSchema.parse(await req.json());

    if (await db.user.findFirst({ where: { username } }))
      throw new UnprocessableEntityResponse("Username already taken");

    const accounts = await db.account.findMany({
      where: {
        userId: session.user.id,
      },
    });

    if (accounts.length > 0)
      throw new ConflictResponse(
        "Email change not possible since you have linked accounts to your mail"
      );

    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        username: username,
      },
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError)
      return new UnprocessableEntityResponse(error.message);

    return new InternalServerErrorResponse();
  }
}
