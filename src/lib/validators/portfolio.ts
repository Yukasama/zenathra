import { z } from "zod";

export const CreatePortfolioSchema = z.object({
  title: z
    .string()
    .min(1, "Title must be at least 1 character long.")
    .max(25, "Title must be less than 25 characters long."),
  isPublic: z.boolean().default(false).optional(),
  stockIds: z
    .array(z.string())
    .max(20, "A maximum of 20 symbols can be added at a time.")
    .optional(),
});

export const ModifyPortfolioSchema = z.object({
  portfolioId: z.string(),
  stockIds: z
    .array(z.string())
    .max(20, "A maximum of 20 symbols can be added at a time."),
});

export const EditPortfolioSchema = z.object({
  portfolioId: z.string(),
  title: z
    .string()
    .min(1, "Title must be at least 1 character long.")
    .max(25, "Title must be less than 25 characters long.")
    .optional(),
  isPublic: z.boolean().optional(),
});

export type CreatePortfolioProps = z.infer<typeof CreatePortfolioSchema>;

export type ModifyPortfolioProps = z.infer<typeof ModifyPortfolioSchema>;

export type EditPortfolioProps = z.infer<typeof EditPortfolioSchema>;
