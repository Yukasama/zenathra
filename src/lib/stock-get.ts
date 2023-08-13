import {
  StockAction,
  TimeFrame,
  AllHistory,
  History,
  Quote,
  Screener,
  StockImage,
} from "@/types/stock";
import { request } from "@/utils/request";
import { Financials, Stock } from "@prisma/client";

export async function getStock(
  symbol: string,
  cache: boolean = true
): Promise<Stock | null> {
  const { data, error } = await request(`/api/stocks/${symbol}`, {
    cache: cache,
  });

  if (error) return null;
  return data;
}

export async function getImage(
  symbol: string,
  cache: boolean = true
): Promise<StockImage | null> {
  const { data, error } = await request(`/api/stocks/${symbol}/image`, {
    cache: cache,
  });

  if (error) return null;
  return data;
}

export async function getStocks(
  symbols: string[],
  cache: boolean = false
): Promise<Stock[] | null> {
  const { data, error } = await request(`/api/stocks/${symbols}`, {
    cache: cache,
  });

  if (error) return null;
  return data;
}

export async function getImages(
  symbols: string[],
  cache: boolean = true
): Promise<StockImage[] | null> {
  const { data, error } = await request(`/api/stocks/${symbols}/image`, {
    cache: cache,
  });

  if (error) return null;
  return data;
}

export async function getFinancials(
  symbol: string,
  cache: boolean = false
): Promise<Financials[] | null> {
  const { data, error } = await request(`/api/financials/${symbol}`, {
    cache: cache,
  });

  if (error) return null;
  return data;
}

export async function searchStocks(
  searchTerm: string
): Promise<Stock[] | null> {
  const { data, error } = await request(`/api/stocks/search/${searchTerm}`);

  if (error) return null;
  return data;
}

export async function queryStocks(screener: Screener): Promise<Stock[] | null> {
  const { data, error } = await request(
    `/api/stocks/query/${JSON.stringify(screener)}`
  );

  if (error) return null;
  return data;
}

export async function getSymbolList(
  symbol: "All" | "US500",
  pullTimes?: number
): Promise<string[][] | null> {
  const { data, error } = await request(`/api/stocks/symbols`, {
    body: { symbol, pullTimes },
    cache: false,
  });

  if (error) return null;
  return data;
}

export async function getDailys(
  action: StockAction,
  cache: boolean = true
): Promise<string[] | null> {
  const { data } = await request(`/api/stocks/dailys/${action}`, {
    cache: cache,
  });

  return data;
}

export async function getHistory(
  symbol: string,
  range: TimeFrame,
  cache: boolean = false
): Promise<History[] | null> {
  const { data, error } = await request(`/api/stocks/history`, {
    body: { symbol: symbol, range: range },
    cache: cache,
  });

  if (error) return null;
  return data;
}

export async function getAllHistory(
  symbol: string,
  cache: boolean = false
): Promise<AllHistory | null> {
  const { data, error } = await request(`/api/stocks/history`, {
    body: { symbol, range: "Everything" },
    cache: cache,
  });

  if (error) return null;
  return data;
}

export async function getCombinedHistory(
  symbol: string[],
  cache: boolean = false
): Promise<AllHistory | null> {
  const { data, error } = await request(`/api/stocks/history`, {
    body: { symbol, range: "Everything" },
    cache: cache,
  });

  if (error) return null;
  return data;
}


