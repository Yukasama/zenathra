import { adminProcedure, publicProcedure, router } from "../trpc";
import { db } from "@/db";
import { z } from "zod";
import { buildFilter } from "@/config/screener";
import axios from "axios";
import { FMP_API_URL, TIMEFRAMES, FMP, historyUrls } from "@/config/fmp";
import type { KindeUser } from "@kinde-oss/kinde-auth-nextjs/server";
import { TRPCError } from "@trpc/server";
import { getSymbols } from "@/lib/fmp/quote";
import { Timeout } from "@/lib/utils";
import { env } from "@/env.mjs";
import { ScreenerSchema } from "@/lib/validators/stock";

export const stockRouter = router({
  query: publicProcedure.input(ScreenerSchema).query(async (opts) => {
    const filter = buildFilter(opts.input);

    return await db.stock.findMany({
      where: filter,
      orderBy: { companyName: "asc" },
    });
  }),
  search: publicProcedure
    .input(
      z.object({
        q: z.string().nonempty(),
      })
    )
    .query(async (opts) => {
      await db.stock.findMany({
        where: { symbol: { startsWith: opts.input.q } },
        include: { _count: true },
        take: 10,
      });
    }),
  history: publicProcedure
    .input(
      z.object({
        symbol: z.string().or(z.array(z.string())),
      })
    )
    .query(async (opts) => {
      const { symbol } = opts.input;

      if (Array.isArray(symbol)) {
        const data = await Promise.all(symbol.map(fetchHistory));

        // Merging symbol data to get average
        let result: any = {};
        data.forEach((symbolData: any) => {
          Object.keys(symbolData).forEach((range) => {
            if (!result[range]) result[range] = [];

            symbolData[range].forEach((entry: any, entryIndex: any) => {
              if (!result[range][entryIndex]) {
                result[range][entryIndex] = {
                  date: entry.date,
                  close: 0,
                };
              }
              result[range][entryIndex].close += entry.close / data.length;
            });
          });
        });
        return result;
      }
      return await fetchHistory(symbol);
    }),
  upload: adminProcedure
    .input(
      z.object({
        stock: z.string({
          required_error: "Please select a stock to upload.",
        }),
        skip: z.boolean().optional(),
        clean: z.boolean().optional(),
        pullTimes: z.number().min(1).max(100).default(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { stock, skip, clean, pullTimes } = input;

      let alreadySymbols: string[] = [];
      if (skip) {
        const allStocks = await db.stock.findMany({
          select: { symbol: true },
        });
        alreadySymbols = allStocks.map((stock) => stock.symbol);
      }

      if (stock === "All" || stock === "US500") {
        const symbolArray = await getSymbols(stock, pullTimes);
        if (!symbolArray)
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

        const totalIterations = symbolArray.length;
        let currentIteration = 0;

        for (let symbols of symbolArray) {
          currentIteration++;

          symbols = symbols.filter((s) => s && s !== null && s !== undefined);
          if (skip)
            symbols = symbols.filter((s) => !alreadySymbols.includes(s));
          if (symbols.length === 0) continue;

          await uploadStocks(symbols, user);
          console.log(
            `Uploaded ${symbols.length} stocks including: ${
              symbols[0] ?? symbols[2] ?? "undefined"
            }`
          );

          if (currentIteration !== totalIterations)
            await Timeout(Number(FMP.timeout));
        }
      } else await uploadStocks([stock], user);

      if (clean)
        await db.stock.deleteMany({
          where: { errorMessage: { not: null } },
        });
    }),
});

async function fetchHistory(symbol: string) {
  const fetchedURLs: Record<string, any> = {};

  for (let timeframe of Object.keys(TIMEFRAMES)) {
    const { url } = TIMEFRAMES[timeframe];
    if (!fetchedURLs[url]) {
      const { data } = await axios.get(historyUrls(symbol, url));
      fetchedURLs[url] = url.includes("price-full") ? data.historical : data;
    }
  }

  return Object.fromEntries(
    Object.entries(TIMEFRAMES).map(([timeframe, { url, limit }]) => {
      const relevantData = fetchedURLs[url];
      return [
        timeframe,
        timeframe !== "ALL"
          ? relevantData
              .slice(
                0,
                relevantData.length < limit ? relevantData.length : limit
              )
              .reverse()
          : relevantData.reverse(),
      ];
    })
  );
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

async function uploadStocks(symbols: string[], user: KindeUser): Promise<void> {
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
        creatorId: user.id,
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
            stockId: createdStock.id,
            creatorId: user.id,
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
            else
              console.log("Error while uploading financials for", symbol, year);
          }
        }
      );
      await Promise.all(financialsPromises);
    } catch {
      console.log("Error while uploading stock", symbol);
    }
  });
  await Promise.all(promises);
}
