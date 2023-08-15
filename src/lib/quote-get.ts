import { Quote } from "@/types/stock";
import { request } from "@/utils/request";

export async function getQuote(
  symbol: string,
  revalidate?: number
): Promise<Quote | null> {
  const { data, error } = await request(`/api/stocks/quote/${symbol}`, {
    cache: false,
    revalidate: revalidate || undefined,
  });

  if (error) return null;

  const result = data ? data[0] : null;
  return result;
}

export async function getQuotes(
  symbols: string[],
  revalidate?: number
): Promise<Quote[] | null> {
  const { data, error } = await request(`/api/stocks/quote/${symbols}`, {
    cache: false,
    revalidate: revalidate || undefined,
  });

  if (error) return null;
  return data;
}

export async function getIndexQuotes(
  revalidate?: number
): Promise<Quote[] | null> {
  const { data, error } = await request("/api/stocks/index-quotes", {
    cache: false,
    revalidate: revalidate || undefined,
  });

  if (error) return null;
  return data;
}
