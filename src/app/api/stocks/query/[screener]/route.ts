import { Screener } from "@/types/stock";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { buildFilter } from "@/utils/build-query-filter";
import { ArgumentError, NotFoundError, ServerError } from "@/lib/errors";
import { z } from "zod";

const Schema = z.object({
  params: z.object({
    screener: z.string().nonempty(),
  }),
});

export async function GET(req: NextRequest, rawParams: unknown) {
  try {
    const result = Schema.safeParse(rawParams);
    if (!result.success) throw new ArgumentError(result.error.message);
    const { screener } = result.data.params;

    let filter;
    try {
      filter = buildFilter(JSON.parse(screener) as Screener);
    } catch {
      throw new ServerError("Query Filter could not be built.");
    }

    const stocks = await db.stock.findMany({
      where: filter,
      orderBy: {
        companyName: "asc",
      },
    });

    if (!stocks) throw new NotFoundError("No stocks matching the query found.");

    return NextResponse.json(stocks);
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: err.status || 500 }
    );
  }
}
