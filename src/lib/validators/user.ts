import { z } from "zod";

export const UserUpdateSchema = z.object({
  familyName: z.string(),
  givenName: z.string(),
  biography: z.string(),
});

export type UserUpdateProps = z.infer<typeof UserUpdateSchema>;
