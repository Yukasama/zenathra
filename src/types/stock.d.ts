export interface History {
  date: string;
  open?: number;
  high?: number;
  low?: number;
  close: number;
  adjClose?: number;
  volume?: number;
  unadjustedVolume?: number;
  change?: number;
  changePercent?: number;
  vwap?: number;
  label?: string;
  changeOverTime?: number;
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

export interface Chart {
  title?: string;
  description?: string;
  data: any[] | undefined;
  height?: number;
  width?: number;
}

export interface AllHistory {
  "1D": History[];
  "5D": History[];
  "1M": History[];
  "6M": History[];
  "1Y": History[];
  "5Y": History[];
  ALL: History[];
}
