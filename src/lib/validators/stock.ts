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

export const SearchStocksSchema = z.object({
  q: z.string().nonempty(),
});

export const StockHistorySchema = z.object({
  symbol: z.string().or(z.array(z.string())),
});

export type UploadStockProps = z.infer<typeof UploadStockSchema>;

export type ScreenerProps = z.infer<typeof ScreenerSchema>;

export type SearchStocksProps = z.infer<typeof SearchStocksSchema>;

export type StockHistoryProps = z.infer<typeof StockHistorySchema>;
