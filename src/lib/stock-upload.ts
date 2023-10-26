import "server-only";

import { db } from "@/db";
import axios from "axios";
import { FMP_API_URL, TIMEFRAMES, historyUrls } from "@/config/fmp/config";
import type { KindeUser } from "@kinde-oss/kinde-auth-nextjs/server";
import { env } from "@/env.mjs";
import logger from "pino";

export async function fetchHistory(symbol: string) {
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
        timeframe !== "All"
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

export async function uploadStocks(
  symbols: string[],
  user: KindeUser
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
            logger().error(
              `[ERROR] Timed out while uploading: ${symbol}, ${year}" \n Error: ${error.message}`
            );
          }
        }
      );
      await Promise.all(financialsPromises);
    } catch {
      logger().error("[ERROR] Uploading stock data for", symbol, "failed");
    }
  });
  await Promise.all(promises);
}
