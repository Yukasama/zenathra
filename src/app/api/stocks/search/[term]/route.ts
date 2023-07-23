import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { ArgumentError, NotFoundError } from "@/lib/errors";
import { z } from "zod";

const Schema = z.object({
  params: z.object({
    term: z.string().nonempty(),
  }),
});

export async function GET(req: NextRequest, rawParams: unknown) {
  try {
    const result = Schema.safeParse(rawParams);
    if (!result.success) throw new ArgumentError(result.error.message);
    const { term } = result.data.params;

    const stocks = await db.stock.findMany({
      where: {
        OR: [
          {
            symbol: {
              contains: term,
              mode: "insensitive",
            },
          },
          {
            companyName: {
              contains: term,
              mode: "insensitive",
            },
          },
        ],
      },
    });

    if (!stocks) throw new NotFoundError("No stocks matching search found.");

    return NextResponse.json(stocks);
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: err.status || 500 }
    );
  }
}
