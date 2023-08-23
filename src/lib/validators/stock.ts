import { z } from "zod";

export const UploadStockSchema = z.object({
  symbol: z.string().nonempty(),
  skip: z.boolean().optional(),
  clean: z.boolean().optional(),
  pullTimes: z.number().int().positive().optional(),
});

export const StockScreenerSchema = z.object({
  screener: z.string().nonempty(),
});

export const SearchStocksSchema = z.object({
  query: z.string().nonempty(),
});

export type UploadStockProps = z.infer<typeof UploadStockSchema>;

export type StockScreenerProps = z.infer<typeof StockScreenerSchema>;

export type SearchStocksProps = z.infer<typeof SearchStocksSchema>;
