import { db } from "@/db";
import { z } from "zod";
import {
  InternalServerErrorResponse,
  UnprocessableEntityResponse,
} from "@/lib/response";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get("q");

    if (!q)
      return new UnprocessableEntityResponse("Missing query parameter 'q'");

    const results = await db.stock.findMany({
      where: { symbol: { startsWith: q } },
      include: { _count: true },
      take: 10,
    });

    return new Response(JSON.stringify(results));
  } catch (error) {
    if (error instanceof z.ZodError)
      return new UnprocessableEntityResponse(error.message);

    return new InternalServerErrorResponse();
  }
}
