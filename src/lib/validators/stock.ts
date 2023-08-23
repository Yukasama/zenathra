import { z } from "zod";

export const UploadStockSchema = z.object({
  symbol: z.string().nonempty(),
  skip: z.boolean().optional(),
  clean: z.boolean().optional(),
  pullTimes: z.number().int().positive().optional(),
});

export type UploadStockProps = z.infer<typeof UploadStockSchema>;
