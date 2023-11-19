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
  cursor: z.number().min(1).default(1),
  take: z.number().min(1).max(50).default(13),
  exchange: z.string(),
  ticker: z.string(),
  sector: z.string(),
  industry: z.string(),
  country: z.string(),
  earningsDate: z.string(),
  peRatio: z.tuple([z.string(), z.string()]),
  pegRatio: z.tuple([z.string(), z.string()]),
  marketCap: z.string(),
});

export const HistorySchema = z.object({
  symbol: z.string(),
  daily: z.boolean().optional(),
  allFields: z.boolean().optional(),
});

export type UploadStockProps = z.infer<typeof UploadStockSchema>;

export type ScreenerProps = z.infer<typeof ScreenerSchema>;
