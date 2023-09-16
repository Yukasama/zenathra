import { z } from "zod";

export const UserSignInSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(1, "Please enter a valid password."),
  remember: z.boolean().optional(),
});

export const UserSignUpSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(11, "Password must be atleast 11 characters."),
  remember: z.boolean().optional(),
});

export const UserUpdateUsernameSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(32)
    .regex(/^[a-zA-Z0-9_]+$/),
});

export const UserUpdateEmailSchema = z.object({
  email: z.string().email("Please enter a valid email."),
});

export const UserUpdatePasswordSchema = z.object({
  password: z.string().min(11, "Password must contain 11 or more characters."),
  token: z.string().nonempty(),
});

export const UserMailSchema = z.object({
  email: z.string().email(),
  userId: z.string().nonempty(),
});

export const UserForgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email."),
});

export type UserSignInProps = z.infer<typeof UserSignInSchema>;

export type UserSignUpProps = z.infer<typeof UserSignUpSchema>;

export type UserUpdateUsernameProps = z.infer<typeof UserUpdateUsernameSchema>;

export type UserUpdateEmailProps = z.infer<typeof UserUpdateEmailSchema>;

export type UserUpdatePasswordProps = z.infer<typeof UserUpdatePasswordSchema>;

export type UserMailProps = z.infer<typeof UserMailSchema>;

export type UserForgotPasswordProps = z.infer<typeof UserForgotPasswordSchema>;

// Password Strength Validator
type Strength = "Weak" | "Medium" | "Strong" | "Ultra" | "Insane";

export function passwordStrength(password: string) {
  const length = password.length;
  const containsNumber = /\d/.test(password);
  const containsCapital = /[A-Z]/.test(password);
  const containsSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  let strength: Strength = "Weak";

  if (length > 17 && containsNumber && containsCapital && containsSymbol)
    strength = "Insane";
  else if (length > 15 && containsNumber && containsCapital) {
    strength = "Ultra";
  } else if (length > 13 && containsNumber) strength = "Strong";
  else if (length > 11) strength = "Medium";

  return strength;
}
