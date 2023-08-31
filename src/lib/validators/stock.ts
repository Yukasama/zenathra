import { z } from "zod";

export const UploadStockSchema = z.object({
  stock: z.string({
    required_error: "Please select a stock to upload.",
  }),
  skip: z.boolean().optional(),
  clean: z.boolean().optional(),
  pullTimes: z.number().min(1).max(100).default(1),
});

export const StockScreenerSchema = z.object({
  exchange: z.string(),
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
  symbol: z.union([z.string(), z.array(z.string())]),
  range: z.enum(["1D", "5D", "1M", "6M", "1Y", "5Y", "ALL", "Everything"]),
});

export type UploadStockProps = z.infer<typeof UploadStockSchema>;

export type StockScreenerProps = z.infer<typeof StockScreenerSchema>;

export type SearchStocksProps = z.infer<typeof SearchStocksSchema>;

export type StockHistoryProps = z.infer<typeof StockHistorySchema>;
