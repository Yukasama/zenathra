import { db } from "@/lib/db";
import { z } from "zod";
import { SearchStocksSchema } from "@/lib/validators/stock";
import {
  InternalServerErrorResponse,
  UnprocessableEntityResponse,
} from "@/lib/response";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const q = url.searchParams.get("q");
    const { query } = SearchStocksSchema.parse({ q });

    const results = await db.stock.findMany({
      where: {
        symbol: {
          startsWith: query,
        },
      },
      include: {
        _count: true,
      },
      take: 10,
    });

    return new Response(JSON.stringify(results));
  } catch (error) {
    if (error instanceof z.ZodError)
      return new UnprocessableEntityResponse(error.message);

    return new InternalServerErrorResponse();
  }
}
