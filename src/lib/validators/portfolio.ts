import { z } from "zod";

export const ModifySymbolsPortfolioSchema = z.object({
  portfolioId: z.string().nonempty(),
  symbols: z
    .array(z.string().nonempty())
    .max(20, "A maximum of 20 symbols can be added at a time."),
});

export type ModifySymbolsPortfolioProps = z.infer<
  typeof ModifySymbolsPortfolioSchema
>;
