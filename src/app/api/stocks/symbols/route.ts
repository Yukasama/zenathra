import { NextRequest, NextResponse } from "next/server";
import { fmpUrls } from "@/config/fmpUrls";
import { ArgumentError, NotFoundError, ServerError } from "@/lib/errors";
import { fmpConfig } from "@/config/fmpApi";
import { z } from "zod";

const Schema = z.object({
  params: z.object({
    symbolSet: z.string().nonempty(),
    pullTimes: z.number().int().positive().optional(),
  }),
});

export async function POST(req: NextRequest, rawParams: unknown) {
  try {
    const result = Schema.safeParse(rawParams);
    if (!result.success) throw new ArgumentError(result.error.message);
    const { symbolSet, pullTimes = 1 } = result.data.params;

    let symbols: any = [];

    const response = await fetch(fmpUrls[symbolSet], { cache: "no-cache" })
      .then((res) => res.json())
      .catch(() => {
        throw new ServerError("Fetch from FMP failed");
      });

    const tempSymbols = response
      .filter(
        (stock: any) =>
          (stock.type === "stock" || symbolSet === "US500") &&
          !stock.symbol.includes(".") &&
          !stock.symbol.includes("-")
      )
      .map((stock: any) => stock.symbol)
      .slice(0, Number(fmpConfig.docsPerPull) * pullTimes) as [];

    if (!tempSymbols.length)
      throw new NotFoundError(`NotFoundError: No data found for ${symbolSet}`);

    for (
      let i = 0;
      i < tempSymbols.length;
      i += Number(fmpConfig.docsPerPull)
    ) {
      symbols.push(tempSymbols.slice(i, i + Number(fmpConfig.docsPerPull)));
    }

    return NextResponse.json(symbols);
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: err.status || 500 }
    );
  }
}
