import { request } from "@/utils/request";

export async function createStocks(
  symbol: string | string[],
  skip?: boolean,
  clean?: boolean,
  pullTimes?: number
) {
  const { error } = await request("/api/admin/create", {
    body: {
      symbol: symbol,
      skip: skip,
      clean: clean,
      pullTimes: pullTimes,
    },
    cache: false,
  });

  return { error };
}

export async function cleanDb(action: string): Promise<number> {
  const { data, error } = await request("/api/admin/clean", {
    body: {
      action: action,
    },
  });

  if (error) return 0;
  return data;
}

export async function getAllSymbols(): Promise<string[]> {
  const { data, error } = await request("/api/stocks/getAllSymbols");

  if (error) return [];
  return data;
}
