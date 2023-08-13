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
