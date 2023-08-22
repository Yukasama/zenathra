import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ArgumentError, NotFoundError } from "@/lib/response";
import { z } from "zod";

const Schema = z.object({
  params: z.object({
    symbol: z.string().nonempty(),
  }),
});

export async function GET(req: NextRequest, rawParams: unknown) {
  try {
    const { symbol } = Schema.parse(rawParams).params;

    let images = null,
      symbols = null;

    if (symbol.includes(",")) {
      // Check if symbol is like AAPL,MSFT
      try {
        symbols = symbol.split(",");
      } catch {
        throw new ArgumentError();
      }
      images = await db.stock.findMany({
        select: {
          symbol: true,
          image: true,
        },
        where: {
          symbol: {
            in: symbols,
          },
        },
      });
    } else {
      images = await db.stock.findUnique({
        select: {
          symbol: true,
          image: true,
        },
        where: {
          symbol: symbol,
        },
      });
    }

    if (!images) throw new NotFoundError();

    return NextResponse.json(images);
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: err.status || 500 }
    );
  }
}
