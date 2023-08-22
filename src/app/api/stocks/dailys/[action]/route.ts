import { NextRequest, NextResponse } from "next/server";
import { fmpUrls } from "@/config/fmp";
import { NotFoundError, ServerError } from "@/lib/errors";
import { z } from "zod";
import { fmpConfig } from "@/config/fmp";

const Schema = z.object({
  params: z.object({
    action: z.string().nonempty(),
  }),
});

export async function GET(req: NextRequest, rawParams: unknown) {
  try {
    const { action } = Schema.parse(rawParams).params;

    if (fmpConfig.simulation)
      return NextResponse.json(["AAPL", "MSFT", "GOOG", "TSLA", "NVDA"]);

    const response = await fetch(fmpUrls[action])
      .then((res) => res.json())
      .catch(() => {
        throw new ServerError("FetchError: Fetch from FMP failed");
      });

    let symbols: string[] = [];
    try {
      symbols = response
        .filter(
          (item: any) =>
            item.name &&
            !item.symbol.includes("-") &&
            !item.name.includes("ProShares")
        )
        .map((item: any) => item.symbol);
    } catch {
      throw new ServerError("Fetch from FMP failed");
    }

    if (!symbols.length) throw new NotFoundError();

    return NextResponse.json(symbols);
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: err.status || 500 }
    );
  }
}
