import { z } from "zod";

export const UserSignUpSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(11, "Password must be atleast 11 characters."),
});

export const UpdateUsernameSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(32)
    .regex(/^[a-zA-Z0-9_]+$/),
});

export const UpdateEmailSchema = z.object({
  email: z.string().email("Invalid email address."),
});

export const UpdatePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Please enter a valid password."),
  password: z.string().min(11, "Password must contain 11 or more characters."),
});

export const UserSendMailSchema = z.object({
  email: z.string().email(),
  subject: z.string().nonempty(),
  message: z.string().nonempty(),
});

export type UserSignUpProps = z.infer<typeof UserSignUpSchema>;

export type UsernameProps = z.infer<typeof UpdateUsernameSchema>;

export type EmailProps = z.infer<typeof UpdateEmailSchema>;

export type UserUpdatePasswordProps = z.infer<typeof UpdatePasswordSchema>;

export type UserSendMailProps = z.infer<typeof UserSendMailSchema>;

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
