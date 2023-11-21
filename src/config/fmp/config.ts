import "server-only";

import { env } from "@/env.mjs";

export const FMP = {
  timeout: 60000, // 60 seconds
  docsPerPull: 33,
  simulation: false,
};

export const FMP_API_URL = "https://financialmodelingprep.com/api/";

export const FMP_URLS = {
  All: `${FMP_API_URL}v3/stock/list?apikey=${env.FMP_API_KEY}`,
  US500: `${FMP_API_URL}v3/sp500_constituent?apikey=${env.FMP_API_KEY}`,

  actives: `${FMP_API_URL}v3/stock_market/actives?apikey=${env.FMP_API_KEY}`,
  winners: `${FMP_API_URL}v3/stock_market/gainers?apikey=${env.FMP_API_KEY}`,
  losers: `${FMP_API_URL}v3/stock_market/losers?apikey=${env.FMP_API_KEY}`,
  indexQuotes: `${FMP_API_URL}v3/quotes/index?apikey=${env.FMP_API_KEY}`,
};

export const TIMEFRAMES: Record<
  string,
  {
    url: string;
    limit: number;
  }
> = {
  "1D": { url: "historical-chart/1min", limit: 392 },
  "5D": { url: "historical-chart/5min", limit: 395 },
  "1M": { url: "historical-chart/15min", limit: 625 },
  "6M": { url: "historical-price-full", limit: 126 },
  "1Y": { url: "historical-price-full", limit: 252 },
  "5Y": { url: "historical-price-full", limit: 1500 },
  All: { url: "historical-price-full", limit: 5000 },
};

export function historyUrls(symbol: string, url: string, from?: Date) {
  return `${FMP_API_URL}v3/${url}/${symbol}?${
    url.includes("price-full")
      ? "from=1975-01-01"
      : from && `from=${from.toDateString().split("T")[0]}`
  }&apikey=${process.env.FMP_API_KEY}`;
}
