import { Stock } from "@prisma/client";
import { env } from "@/env.mjs";

export async function getFAR(stock: Stock) {
  const indicatorUrls = [
    `https://financialmodelingprep.com/api/v3/income-statement/${stock.symbol}?limit=120&apikey=${env.FMP_API_KEY}`,
    `https://financialmodelingprep.com/api/v3/balance-sheet-statement/${stock.symbol}?limit=120&apikey=${env.FMP_API_KEY}`,
    `https://financialmodelingprep.com/api/v3/cash-flow-statement/${stock.symbol}?limit=120&apikey=${env.FMP_API_KEY}`,
    `https://financialmodelingprep.com/api/v3/ratios/${stock.symbol}?limit=120&apikey=${env.FMP_API_KEY}`,
    `https://financialmodelingprep.com/api/v3/key-metrics/${stock.symbol}?limit=120&apikey=${env.FMP_API_KEY}`,
  ];
}
