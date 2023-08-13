import { NextRequest, NextResponse } from "next/server";
import { env } from "@/env.mjs";
import { NotFoundError, ServerError } from "@/lib/errors";
import { z } from "zod";
import { fmpConfig } from "@/config/fmp-api";
import { quote } from "@/config/fmp-data";

const Schema = z.object({
  params: z.object({
    symbol: z.string().nonempty(),
  }),
});

export async function GET(req: NextRequest, rawParams: unknown) {
  try {
    const { symbol } = Schema.parse(rawParams).params;

    let symbols = null;

    // Check if symbol is like AAPL,MSFT
    try {
      symbols = symbol.split(",").map((s) => s.trim());
    } catch {
      symbols = symbol;
    }

    if (symbols.length > 20) symbols = symbols.slice(0, 20);

    const url = `${env.NEXT_PUBLIC_FMP_API_URL}v3/quote/${
      Array.isArray(symbols) ? symbols.join(",") : symbols
    }?apikey=${env.FMP_API_KEY}`;

    const response = fmpConfig.simulation
      ? quote
      : await fetch(url, { cache: "no-cache" })
          .then(async (res) => await res.json())
          .catch(() => {
            throw new ServerError("Fetch from FMP failed");
          });

    const quotes = Array.isArray(response) ? response : [response];
    if (!quotes.length) throw new NotFoundError();

    return NextResponse.json(quotes);
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: err.status || 500 }
    );
  }
}
