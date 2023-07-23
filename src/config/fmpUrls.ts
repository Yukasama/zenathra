import { TimeFrame } from "@/types/stock";
import { env } from "@/env.mjs";

export const fmpUrls: any = {
  All: `${env.NEXT_PUBLIC_FMP_API_URL}v3/stock/list?apikey=${env.FMP_API_KEY}`,
  US500: `${env.NEXT_PUBLIC_FMP_API_URL}v3/sp500_constituent?apikey=${env.FMP_API_KEY}`,

  actives: `${env.NEXT_PUBLIC_FMP_API_URL}v3/stock_market/actives?apikey=${env.FMP_API_KEY}`,
  winners: `${env.NEXT_PUBLIC_FMP_API_URL}v3/stock_market/gainers?apikey=${env.FMP_API_KEY}`,
  losers: `${env.NEXT_PUBLIC_FMP_API_URL}v3/stock_market/losers?apikey=${env.FMP_API_KEY}`,
  indexQuotes: `${env.NEXT_PUBLIC_FMP_API_URL}v3/quotes/index?apikey=${env.FMP_API_KEY}`,
};

export const historyUrls: any = (symbol: string, timeFrame: TimeFrame) => {
  const urls: any = {
    min1: `${env.NEXT_PUBLIC_FMP_API_URL}v3/historical-chart/1min/${symbol}?apikey=${env.FMP_API_KEY}`,
    min5: `${env.NEXT_PUBLIC_FMP_API_URL}v3/historical-chart/5min/${symbol}?apikey=${env.FMP_API_KEY}`,
    min30: `${env.NEXT_PUBLIC_FMP_API_URL}v3/historical-chart/30min/${symbol}?apikey=${env.FMP_API_KEY}`,
    hour1: `${env.NEXT_PUBLIC_FMP_API_URL}v3/historical-chart/1hour/${symbol}?apikey=${env.FMP_API_KEY}`,
    hour4: `${env.NEXT_PUBLIC_FMP_API_URL}v3/historical-chart/4hour/${symbol}?apikey=${env.FMP_API_KEY}`,
    day1: `${env.NEXT_PUBLIC_FMP_API_URL}v3/historical-price-full/${symbol}?apikey=${env.FMP_API_KEY}`,
  };

  return urls[timeFrame];
};
