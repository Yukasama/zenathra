import "server-only";

import db from "@/lib/db";
import { env } from "@/env.mjs";

export function MergeArrays(
  arrays: Record<string, any>[][]
): Record<string, any>[] {
  if (
    !Array.isArray(arrays) ||
    !arrays.every((array) => Array.isArray(array))
  ) {
    return [];
  }

  const result: Record<string, any>[] = [];
  for (const array of arrays) {
    if (!array.every((item) => typeof item === "object" && item.date)) {
      throw new Error(
        "Each sub-array must contain objects with a 'date' property."
      );
    }

    for (const item of array) {
      const existingItem = result.find((i) => i.date === item.date);
      if (existingItem) {
        Object.assign(existingItem, item);
      } else {
        result.push(item);
      }
    }
  }
  return result;
}

export default async function create(symbols: string[]): Promise<void> {
  if (!symbols.length) throw new Error("ArgumentError: No symbols provided");

  const financialUrls = symbols.map((symbol) => [
    `${env.NEXT_PUBLIC_FMP_API_URL}v3/income-statement/${symbol}?limit=120&apikey=${env.FMP_API_KEY}`,
    `${env.NEXT_PUBLIC_FMP_API_URL}v3/balance-sheet-statement/${symbol}?limit=120&apikey=${env.FMP_API_KEY}`,
    `${env.NEXT_PUBLIC_FMP_API_URL}v3/cash-flow-statement/${symbol}?limit=120&apikey=${env.FMP_API_KEY}`,
    `${env.NEXT_PUBLIC_FMP_API_URL}v3/ratios/${symbol}?limit=120&apikey=${env.FMP_API_KEY}`,
    `${env.NEXT_PUBLIC_FMP_API_URL}v3/key-metrics/${symbol}?limit=120&apikey=${env.FMP_API_KEY}`,
  ]);

  const profileUrls = symbols.map((symbol) => [
    `${env.NEXT_PUBLIC_FMP_API_URL}v3/profile/${symbol}?apikey=${env.FMP_API_KEY}`,
    `${env.NEXT_PUBLIC_FMP_API_URL}v3/ratios-ttm/${symbol}?apikey=${env.FMP_API_KEY}`,
    `${env.NEXT_PUBLIC_FMP_API_URL}v3/key-metrics-ttm/${symbol}?apikey=${env.FMP_API_KEY}`,
    `${env.NEXT_PUBLIC_FMP_API_URL}v4/stock_peers?symbol=${symbol}&apikey=${env.FMP_API_KEY}`,
    //`${env.NEXT_PUBLIC_FMP_API_URL}v4/price-target-consensus?symbol=${symbol}&apikey=${env.FMP_API_KEY}`,
  ]);

  const responses = await Promise.allSettled(
    financialUrls.map(async (urls) => {
      const jsonObjects = await Promise.all(
        urls.map(async (url) => {
          try {
            const response = await fetch(url, { cache: "no-cache" });
            return await response.json();
          } catch (error) {
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
    } catch (error) {
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
          return {
            ...acc,
            ...data,
          };
        }, {});
      } catch {
        return {};
      }
    })
  );

  const promises = symbols.map(async (symbol, index) => {
    const stock = {
      ...stocks[index],
      createdAt: new Date(),
      updatedAt: new Date(),
      pegRatioTTM: Math.abs(stocks[index].peRatioTTM),
    };

    const existingStock = await db.stock.findUnique({
      where: { symbol },
    });

    if (existingStock) {
      await db.stock.update({
        where: { symbol },
        data: { ...stock, updatedAt: new Date() },
      });
    } else {
      await db.stock.create({
        data: stock,
      });
    }

    const statements = combinedData[index];

    const statementsByYear = statements.reduce((acc, statement) => {
      const year = statement.date.split("-")[0];
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(statement);
      return acc;
    }, {});

    const financialsPromises = Object.entries(statementsByYear).map(
      async ([year, statements]) => {
        const financialData = statements[0];

        const existingFinancial = await db.financials.findUnique({
          where: { symbol_calendarYear: { symbol, calendarYear: year } },
        });

        if (existingFinancial) {
          await db.financials.update({
            where: { symbol_calendarYear: { symbol, calendarYear: year } },
            data: { ...financialData, updatedAt: new Date() },
          });
        } else {
          await db.financials.create({
            data: {
              ...financialData,
              stockId: stock.id,
              createdAt: new Date(),
              updatedAt: new Date(),
              stock: { connect: { symbol } },
            },
          });
        }
      }
    );

    await Promise.all(financialsPromises);
  });

  await Promise.all(promises);
}
