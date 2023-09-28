import { Timeout } from "@/lib/utils";
import { FMP_API_URL, fmpConfig } from "@/config/fmp";
import { db } from "@/lib/db";
import {
  ForbiddenResponse,
  InternalServerErrorResponse,
  UnauthorizedResponse,
  UnprocessableEntityResponse,
} from "@/lib/response";
import { z } from "zod";
import { getAuthSession } from "@/lib/auth";
import { UploadStockSchema } from "@/lib/validators/stock";
import { env } from "@/env.mjs";
import { getSymbols } from "@/lib/fmp/quote";
import { Session } from "next-auth";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new UnauthorizedResponse();

    const { stock, skip, clean, pullTimes } = UploadStockSchema.parse(
      await req.json()
    );

    const user = await db.user.findFirst({
      select: { role: true },
      where: { id: session.user.id },
    });

    if (user?.role !== "admin") return new ForbiddenResponse();

    let alreadySymbols: string[] = [];
    if (skip) {
      const allStocks = await db.stock.findMany({
        select: { symbol: true },
      });
      alreadySymbols = allStocks.map((stock) => stock.symbol);
    }

    if (stock === "All" || stock === "US500") {
      const symbolArray = await getSymbols(stock, pullTimes);
      if (!symbolArray) return new InternalServerErrorResponse();

      const totalIterations = symbolArray.length;
      let currentIteration = 0;

      for (let symbols of symbolArray) {
        currentIteration++;

        symbols = symbols.filter((s) => s && s !== null && s !== undefined);
        if (skip) symbols = symbols.filter((s) => !alreadySymbols.includes(s));
        if (symbols.length === 0) continue;

        await uploadStocks(symbols, session);
        console.log(
          `Uploaded ${symbols.length} stocks including: ${
            symbols[0] ?? symbols[2] ?? "undefined"
          }`
        );

        if (currentIteration !== totalIterations)
          await Timeout(Number(fmpConfig.timeout));
      }
    } else await uploadStocks([stock], session);

    if (clean)
      await db.stock.deleteMany({
        where: { errorMessage: { not: null } },
      });

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError)
      return new UnprocessableEntityResponse(error.message);

    return new InternalServerErrorResponse();
  }
}

function MergeArrays(arrays: Record<string, any>[][]): Record<string, any>[] {
  if (!Array.isArray(arrays) || !arrays.every((array) => Array.isArray(array)))
    return [];

  const result: Record<string, any>[] = [];
  for (const array of arrays) {
    if (!array.every((item) => typeof item === "object" && item.date))
      throw new Error(
        "Each sub-array must contain objects with a 'date' property."
      );
    for (const item of array) {
      const existingItem = result.find((i) => i.date === item.date);
      if (existingItem) Object.assign(existingItem, item);
      else result.push(item);
    }
  }
  return result;
}

async function uploadStocks(
  symbols: string[],
  session: Session
): Promise<void> {
  if (!symbols.length) throw new Error("ArgumentError: No symbols provided");

  const financialUrls = symbols.map((symbol) => [
    `${FMP_API_URL}v3/income-statement/${symbol}?limit=120&apikey=${env.FMP_API_KEY}`,
    `${FMP_API_URL}v3/balance-sheet-statement/${symbol}?limit=120&apikey=${env.FMP_API_KEY}`,
    `${FMP_API_URL}v3/cash-flow-statement/${symbol}?limit=120&apikey=${env.FMP_API_KEY}`,
    `${FMP_API_URL}v3/ratios/${symbol}?limit=120&apikey=${env.FMP_API_KEY}`,
    `${FMP_API_URL}v3/key-metrics/${symbol}?limit=120&apikey=${env.FMP_API_KEY}`,
  ]);

  const profileUrls = symbols.map((symbol) => [
    `${FMP_API_URL}v3/profile/${symbol}?apikey=${env.FMP_API_KEY}`,
    `${FMP_API_URL}v3/ratios-ttm/${symbol}?apikey=${env.FMP_API_KEY}`,
    `${FMP_API_URL}v3/key-metrics-ttm/${symbol}?apikey=${env.FMP_API_KEY}`,
    `${FMP_API_URL}v4/stock_peers?symbol=${symbol}&apikey=${env.FMP_API_KEY}`,
    //`${FMP_API_URL}v4/price-target-consensus?symbol=${symbol}&apikey=${env.FMP_API_KEY}`,
  ]);

  const responses = await Promise.allSettled(
    financialUrls.map(async (urls) => {
      const jsonObjects = await Promise.all(
        urls.map(async (url) => {
          try {
            const response = await fetch(url, { cache: "no-cache" });
            return await response.json();
          } catch {
            return undefined;
          }
        })
      );
      return jsonObjects.filter((obj) => obj !== undefined);
    })
  );

  const combinedData = responses.map((result) => {
    try {
      if (result.status === "fulfilled") {
        const res = MergeArrays(result.value);
        if (res.length) return res;
      }
      return [];
    } catch {
      return [];
    }
  });

  const stocks: any[] = await Promise.all(
    profileUrls.map(async (urls) => {
      try {
        const responses = await Promise.all(
          urls.map(async (url) => {
            const response = await fetch(url, { cache: "no-cache" });
            return response.json();
          })
        );
        return responses.flat().reduce((acc, data) => {
          return { ...acc, ...data };
        }, {});
      } catch {
        return {};
      }
    })
  );

  const promises = symbols.map(async (symbol, i) => {
    try {
      const stock = {
        ...stocks[i],
        updatedAt: new Date(),
        creator: { connect: { id: session.user.id } },
        peersList: stocks[i].peersList ? stocks[i].peersList.join(",") : "",
        errorMessage: stocks[i]["Error Message"],
        "Error Message": undefined,
      };

      const createdStock = await db.stock.upsert({
        where: { symbol },
        update: stock,
        create: {
          ...stock,
          createdAt: new Date(),
        },
      });

      const statementsByYear = combinedData[i].reduce((acc, statement) => {
        const year = statement.date.split("-")[0];
        if (!acc[year]) acc[year] = [];
        acc[year].push(statement);
        return acc;
      }, {});

      const financialsPromises = Object.entries(statementsByYear).map(
        async ([year, statements]) => {
          const financialData = {
            ...statements[0],
            updatedAt: new Date(),
            stock: { connect: { id: createdStock.id } },
            creator: { connect: { id: session.user.id } },
            errorMessage: statements[0]["Error Message"],
            "Error Message": undefined,
          };

          try {
            await db.financials.upsert({
              where: {
                stockId_calendarYear: {
                  stockId: createdStock.id,
                  calendarYear: year,
                },
              },
              update: financialData,
              create: {
                ...financialData,
                createdAt: new Date(),
              },
            });
          } catch (error: any) {
            if (error.message.includes("Timed out"))
              console.log("Timed out while uploading", symbol, year);
            else console.log("Error uploading financials for", symbol, year);
          }
        }
      );
      await Promise.all(financialsPromises);
    } catch {
      console.log("Error uploading stock", symbol);
    }
  });
  await Promise.all(promises);
}
