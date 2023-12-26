import { z } from "zod";

export const UploadStockSchema = z.object({
  stock: z.string({
    required_error: "Please select a stock to upload.",
  }),
  skip: z.boolean().optional(),
  clean: z.boolean().optional(),
  pullTimes: z.number().min(1).max(100).default(1),
});

export const ScreenerSchema = z.object({
  cursor: z.number().min(1).default(1).optional(),
  take: z.number().min(1).max(50).default(10).optional(),
  exchange: z.string(),
  ticker: z.string().optional(),
  sector: z.string(),
  industry: z.string(),
  country: z.string(),
  earningsDate: z.string(),
  peRatio: z.tuple([z.string(), z.string()]),
  pegRatio: z.tuple([z.string(), z.string()]),
  marketCap: z.string(),
  sma50: z.tuple([z.string(), z.string()]),
});

export const HistorySchema = z.object({
  symbol: z.string(),
  timeframe: z.enum(["1D", "5D", "1M", "6M", "1Y", "5Y", "All"]),
  allFields: z.boolean().optional(),
});

export type UploadStockProps = z.infer<typeof UploadStockSchema>;

export type ScreenerProps = z.infer<typeof ScreenerSchema>;

export type HistoryProps = z.infer<typeof HistorySchema>;
