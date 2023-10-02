import { z } from "zod";

export const CreatePortfolioSchema = z.object({
  title: z
    .string()
    .min(1, "Title must be at least 1 character long.")
    .max(20, "Title must be less than 20 characters long."),
  publicPortfolio: z.boolean().optional(),
  stockIds: z
    .array(z.string().nonempty())
    .max(20, "A maximum of 20 symbols can be added at a time.")
    .optional(),
});

export const ModifySymbolsPortfolioSchema = z.object({
  portfolioId: z.string().nonempty(),
  stockIds: z
    .string()
    .or(
      z
        .array(z.string())
        .max(20, "A maximum of 20 symbols can be added at a time.")
    ),
});

export const DeletePortfolioSchema = z.object({
  portfolioId: z.string().nonempty(),
});

export type CreatePortfolioProps = z.infer<typeof CreatePortfolioSchema>;

export type ModifySymbolsPortfolioProps = z.infer<
  typeof ModifySymbolsPortfolioSchema
>;

export type DeletePortfolioProps = z.infer<typeof DeletePortfolioSchema>;
