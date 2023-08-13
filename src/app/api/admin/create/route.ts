import { Timeout, Timer } from "@/lib/utils";
import { getSymbolList } from "@/lib/stock-get";
import { cleanDb } from "@/lib/stock-update";
import create from "@/lib/stock-create";
import { NextRequest, NextResponse } from "next/server";
import { fmpConfig } from "@/config/fmp-api";
import db from "@/lib/db";
import { getUser } from "@/lib/user";
import { ArgumentError, PermissionError, ServerError } from "@/lib/errors";
import { z } from "zod";

const Schema = z.object({
  symbol: z.string().nonempty(),
  skip: z.boolean().optional(),
  clean: z.boolean().optional(),
  pullTimes: z.number().int().positive().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) throw new PermissionError("User is not logged in.");

    const howLong = Timer();

    const result = Schema.safeParse(await req.json());
    if (!result.success) throw new ArgumentError(result.error.message);
    const { symbol, skip = false, clean = false, pullTimes = 1 } = result.data;

    if (!symbol) throw new ArgumentError();
    if (user.role !== "admin") throw new PermissionError();

    let alreadySymbols: string[] = [];
    if (skip) {
      const allStocks = await db.stock.findMany({
        select: {
          symbol: true,
        },
      });
      alreadySymbols = allStocks.map((stock) => stock.symbol);
    }

    let symbolArray: string[] | string[][] | null = [];
    let pulls = pullTimes || 1;

    if (symbol === "All" || symbol === "US500") {
      symbolArray = await getSymbolList(symbol, pulls);

      if (!symbolArray) throw new ServerError("Symbols could not be fetched.");

      let currentIteration = 0;
      const totalIterations = symbolArray.length;

      for (let symbols of symbolArray) {
        currentIteration++;

        symbols = symbols.filter((s) => s && s !== null && s !== undefined);
        if (skip) symbols = symbols.filter((s) => !alreadySymbols.includes(s));
        if (symbols.length === 0) {
          console.log(`${Number(fmpConfig.docsPerPull)} symbols were skipped.`);
          continue;
        }

        try {
          await create(symbols);
          console.log(
            `${Number(
              fmpConfig.docsPerPull
            )} symbols have been written to Database in ${
              howLong.ms
            } (including ${symbols[0]}${symbols[1] && ", " + symbols[1]}${
              symbols[2] && ", " + symbols[2]
            }).`
          );
        } catch {
          console.error(`Failed to write symbols to Database.`);
        }

        if (currentIteration !== totalIterations)
          await Timeout(Number(fmpConfig.timeout));
      }
    } else {
      symbolArray = [symbol];

      try {
        await create(symbolArray);
        console.log(`${symbol} has been written to Database in ${howLong.ms}.`);
      } catch {
        console.error(`Failed to write ${symbol} to Database.`);
      }
    }

    if (clean) await cleanDb("Stocks");

    return NextResponse.json({ message: "Stocks created successfully." });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: err.status || 500 }
    );
  }
}
