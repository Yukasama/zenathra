import { Timeout } from "@/lib/utils";
import { fmpConfig } from "@/config/fmp";
import { db } from "@/lib/db";
import {
  BadRequestResponse,
  ForbiddenResponse,
  InternalServerErrorResponse,
  UnauthorizedResponse,
  UnprocessableEntityResponse,
} from "@/lib/response";
import { z } from "zod";
import uploadStocks from "@/lib/upload-stocks";
import axios from "axios";
import { getAuthSession } from "@/lib/auth";
import { UploadStockSchema } from "@/lib/validators/stock";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new UnauthorizedResponse();

    const { symbol, skip, clean, pullTimes } = UploadStockSchema.parse(
      await req.json()
    );

    const user = await db.user.findFirst({
      where: { id: session.user.id },
    });

    if (!user) return new UnauthorizedResponse();
    if (user.role !== "admin") return new ForbiddenResponse();

    let alreadySymbols: string[] = [];
    if (skip) {
      const allStocks = await db.stock.findMany({
        select: {
          symbol: true,
        },
      });
      alreadySymbols = allStocks.map((stock) => stock.symbol);
    }

    if (symbol === "All" || symbol === "US500") {
      const { data } = await axios.post("/api/stocks/symbols", {
        symbolSet: symbol,
        pullTimes: pullTimes || 1,
      });
      const symbolArray: string[][] = data;

      if (!symbolArray)
        return new InternalServerErrorResponse("Symbols could not be fetched.");

      const totalIterations = symbolArray.length;
      let currentIteration = 0;

      for (let symbols of symbolArray) {
        currentIteration++;

        symbols = symbols.filter((s) => s && s !== null && s !== undefined);
        if (skip) symbols = symbols.filter((s) => !alreadySymbols.includes(s));
        if (symbols.length === 0) continue;

        await uploadStocks(symbols);

        if (currentIteration !== totalIterations)
          await Timeout(Number(fmpConfig.timeout));
      }
    } else await uploadStocks([symbol]);

    if (clean) await axios.post("/api/admin/clean");

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError)
      return new UnprocessableEntityResponse(error.message);

    return new InternalServerErrorResponse(
      "Failed to write stocks to the database"
    );
  }
}
