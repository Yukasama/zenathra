export type History = {
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
};

export type Screener = {
  exchange: string;
  sector: string;
  industry: string;
  country: string;
  earningsDate: string;
  marketCap: string;
  peRatio: [string, string];
  pegRatio: [string, string];
};

export type Quote = {
  symbol: string;
  name: string;
  price: number;
  changesPercentage: number;
  change: number;
  dayLow: number;
  dayHigh: number;
  yearHigh: number;
  yearLow: number;
  marketCap: number;
  priceAvg50: number;
  priceAvg200: number;
  exchange: string;
  volume: number;
  avgVolume: number;
  open: number;
  previousClose: number;
  eps: number;
  pe: number;
  earningsAnnouncement: string;
  sharesOutstanding: number;
  timestamp: number;
};

export type StockChartProps = {
  title?: string;
  labels: string[];
  data: {}[];
  labelType?: string;
  size?: "lg" | "md" | "sm";
};

export type StockAction = "actives" | "winners" | "losers";

export type TimeFrame = "1D" | "5D" | "1M" | "6M" | "1Y" | "5Y" | "ALL";

export type AllHistory = { [key in TimeFrame]: History[] | null };
