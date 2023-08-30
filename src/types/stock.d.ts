export interface History {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  adjClose: number;
  volume: number;
  unadjustedVolume: number;
  change: number;
  changePercent: number;
  vwap: number;
  label: string;
  changeOverTime: number;
}

export interface Screener {
  exchange: string;
  sector: string;
  industry: string;
  country: string;
  earningsDate: string;
  marketCap: string;
  peRatio: [string, string];
  pegRatio: [string, string];
}

export interface Quote {
  symbol: string;
  name: string;
  price: number;
  changesPercentage: number;
  change: number;
  dayLow: number;
  dayHigh: number;
  yearHigh: number;
  yearLow: number;
  marketCap: number | null;
  priceAvg50: number;
  priceAvg200: number;
  exchange: string | null;
  volume: number;
  avgVolume: number;
  open: number;
  previousClose: number | null;
  eps: number | null;
  pe: number | null;
  earningsAnnouncement: string | null;
  sharesOutstanding: number | null;
  timestamp: number;
}

export interface ChartProps {
  title?: string;
  description?: string;
  data: {}[];
  size?: "sm" | "md" | "lg";
}

export type StockAction = "actives" | "winners" | "losers";

export type TimeFrame = "1D" | "5D" | "1M" | "6M" | "1Y" | "5Y" | "ALL";

export interface AllHistory {
  [key in TimeFrame]: History[] | null;
}
