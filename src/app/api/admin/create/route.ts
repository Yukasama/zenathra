import { Timeout, Timer } from "@/lib/utils";
import { getSymbolList } from "@/lib/stock-get";
import { fmpConfig } from "@/config/fmp";
import { db } from "@/lib/db";
import { getUser } from "@/lib/user";
import {
  InternalServerErrorResponse,
  UnprocessableEntityResponse,
} from "@/lib/response";
import { z } from "zod";
import uploadStocks from "@/lib/upload-stocks";
import axios from "axios";

const Schema = z.object({
  symbol: z.string().nonempty(),
  skip: z.boolean().optional(),
  clean: z.boolean().optional(),
  pullTimes: z.number().int().positive().optional(),
});

export async function POST(req: Request) {
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
          await uploadStocks(symbols);
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
        await uploadStocks(symbolArray);
        console.log(`${symbol} has been written to Database in ${howLong.ms}.`);
      } catch {
        console.error(`Failed to write ${symbol} to Database.`);
      }
    }

    if (clean) await axios.post("/api/admin/clean");

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError)
      return new UnprocessableEntityResponse(error.message);

    return new InternalServerErrorResponse();
  }
}
