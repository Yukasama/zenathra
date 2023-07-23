import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import db from "@/lib/db";
import { ArgumentError, NotFoundError } from "@/lib/errors";

const Schema = z.object({
  params: z.object({
    symbol: z.string().nonempty(),
  }),
});

export async function GET(req: NextRequest, rawParams: unknown) {
  try {
    const result = Schema.safeParse(rawParams);
    if (!result.success) throw new ArgumentError(result.error.message);
    const { symbol } = result.data.params;

    const financials = await db.financials.findMany({
      where: {
        stock: {
          symbol: symbol,
        },
      },
      orderBy: {
        calendarYear: "desc",
      },
    });

    if (!financials || financials.length === 0)
      throw new NotFoundError("No financials were found.");

    return NextResponse.json(financials);
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: err.status || 500 }
    );
  }
}
