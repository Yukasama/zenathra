import { z } from "zod";

export const CreateUserSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(1, "Please enter a valid password."),
});

export const UserSignUpSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(11, "Password must be atleast 11 characters."),
});

export const UserUpdateSchema = z.object({
  username: z.string().optional(),
  email: z.string().optional(),
  biography: z.string().optional(),
});

export const ResetPasswordSchema = z.object({
  password: z.string().min(11, "Password must contain 11 or more characters."),
  token: z.string(),
});

export const UserMailSchema = z.object({
  email: z.string().email("Please enter a valid email."),
});

export type UserUpdateProps = z.infer<typeof UserUpdateSchema>;

export type UserSignUpProps = z.infer<typeof UserSignUpSchema>;

export type CreateUserProps = z.infer<typeof CreateUserSchema>;

export type ResetPasswordProps = z.infer<typeof ResetPasswordSchema>;

export type UserMailProps = z.infer<typeof UserMailSchema>;

