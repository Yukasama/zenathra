import { Screener } from "@/types/stock";
import { db } from "@/lib/db";
import { buildFilter } from "@/config/screener";
import { StockScreenerSchema } from "@/lib/validators/stock";
import { z } from "zod";
import {
  InternalServerErrorResponse,
  UnprocessableEntityResponse,
} from "@/lib/response";

export async function GET(req: Request) {
  try {
    const { screener } = StockScreenerSchema.parse(await req.json());

    const filter = buildFilter(JSON.parse(screener) as Screener);

    const stocks = await db.stock.findMany({
      where: filter,
      orderBy: {
        companyName: "asc",
      },
    });

    return new Response(JSON.stringify(stocks));
  } catch (error) {
    if (error instanceof z.ZodError)
      return new UnprocessableEntityResponse(error.message);

    return new InternalServerErrorResponse();
  }
}
