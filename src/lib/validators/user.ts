import { z } from "zod";

export const UserUpdateSchema = z.object({
  username: z.string().optional(),
  biography: z.string().optional(),
});

export type UserUpdateProps = z.infer<typeof UserUpdateSchema>;
