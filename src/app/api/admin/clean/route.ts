import { db } from "@/lib/db";
import {
  InternalServerErrorResponse,
  UnauthorizedResponse,
  UnprocessableEntityResponse,
} from "@/lib/response";
import { z } from "zod";
import { getAuthSession } from "@/lib/auth";

export async function POST() {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new UnauthorizedResponse();

    const count = await db.stock.deleteMany({
      where: {
        symbol: undefined,
      },
    });

    return new Response(count.toString());
  } catch (error) {
    if (error instanceof z.ZodError)
      return new UnprocessableEntityResponse(error.message);

    return new InternalServerErrorResponse();
  }
}
