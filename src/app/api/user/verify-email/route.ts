import { sendMail } from "@/lib/mail";
import {
  InternalServerErrorResponse,
  UnprocessableEntityResponse,
} from "@/lib/response";
import { UserSendMailSchema } from "@/lib/validators/user";
import { z } from "zod";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email } = UserSendMailSchema.parse(await req.json());

    const user = await db.user.findFirst({
      select: { id: true },
      where: { email },
    });

    await sendMail(email, "VERFIY", user?.id);

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError)
      return new UnprocessableEntityResponse(error.message);

    return new InternalServerErrorResponse();
  }
}
