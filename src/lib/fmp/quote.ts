import "server-only";

import { FMP_API_URL, FMP, FMP_URLS } from "@/config/fmp/config";
import { indexQuotes, quote } from "@/config/fmp/simulation";
import { env } from "@/env.mjs";
import { Quote } from "@/types/stock";

export async function getDailys(
  action: "actives" | "winners" | "losers"
): Promise<string[] | null> {
  try {
    if (FMP.simulation) return ["AAPL", "MSFT", "GOOG", "TSLA", "NVDA"];

    const response = await fetch(FMP_URLS[action]).then((res) => res.json());

    // Filtering all ETFs and stocks with "-" in their symbol
    const symbols = response
      .filter(
        (item: any) =>
          item.name &&
          !item.symbol.includes("-") &&
          !item.name.includes("ProShares")
      )
      .map((item: any) => item.symbol);

    return symbols;
  } catch {
    return null;
  }
}

export async function getIndexQuotes(): Promise<Quote[] | null> {
  try {
    const requiredIndexes = ["^GSPC", "^GDAXI", "^NDX", "^DJI"];

    if (FMP.simulation) return indexQuotes;

    const data = await fetch(FMP_URLS["indexQuotes"]).then((res) => res.json());

    const results = data.filter((result: any) =>
      requiredIndexes.includes(result.symbol)
    );

    return results;
  } catch {
    return null;
  }
}

export async function getQuote(
  symbol: string | undefined
): Promise<Quote | null> {
  try {
    if (!symbol) return null;
    if (FMP.simulation) return quote;

    const url = `${FMP_API_URL}v3/quote/${symbol}?apikey=${env.FMP_API_KEY}`;

    const data = await fetch(url).then((res) => res.json());

    return data[0];
  } catch {
    return null;
  }
}

export async function getQuotes(symbols: string[]): Promise<Quote[] | null> {
  try {
    if (FMP.simulation) return [quote, quote, quote, quote, quote];

    if (symbols.length > 20) symbols = symbols.slice(0, 20);

    const url = `${FMP_API_URL}v3/quote/${symbols.join(",")}?apikey=${
      env.FMP_API_KEY
    }`;

    return await fetch(url).then((res) => res.json());
  } catch {
    return null;
  }
}

export async function getSymbols(
  symbolSet: "All" | "US500",
  pullTimes = 1
): Promise<string[][] | null> {
  try {
    if (FMP.simulation)
      return [
        ["AAPL", "MSFT", "GOOG"],
        ["TSLA", "NVDA", "META"],
      ];

    const url = FMP_URLS[symbolSet];

    const data = await fetch(url).then((res) => res.json());

    const results = data
      .filter(
        (stock: any) =>
          (stock.type === "stock" || symbolSet === "US500") &&
          !stock.symbol.includes(".") &&
          !stock.symbol.includes("-")
      )
      .map((stock: any) => stock.symbol)
      .slice(0, Number(FMP.docsPerPull) * pullTimes) as [];

    const symbols = [];

    // Splitting the symbols into batches with length of FMP.docsPerPull
    for (let i = 0; i < results.length; i += Number(FMP.docsPerPull))
      symbols.push(results.slice(i, i + Number(FMP.docsPerPull)));

    return symbols;
  } catch {
    return null;
  }
}
