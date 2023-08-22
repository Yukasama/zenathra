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

    let stocks = null;
    let symbols = null;

    if (symbol.includes(",")) {
      // Check if symbol is like AAPL,MSFT
      try {
        symbols = symbol.split(",");
      } catch {
        throw new ArgumentError();
      }
      stocks = await db.stock.findMany({
        where: {
          symbol: {
            in: symbols,
          },
        },
      });
    } else {
      stocks = await db.stock.findUnique({
        where: {
          symbol: symbol,
        },
      });
    }

    if (!stocks) throw new NotFoundError();

    return NextResponse.json(stocks);
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: err.status || 500 }
    );
  }
}
