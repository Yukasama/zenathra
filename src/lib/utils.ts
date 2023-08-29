import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",

  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function Timer() {
  let timeStart = new Date().getTime();
  return {
    get seconds() {
      const seconds =
        Math.ceil((new Date().getTime() - timeStart) / 1000) + "s";
      return seconds;
    },
    get ms() {
      const ms = new Date().getTime() - timeStart + "ms";
      return ms;
    },
  };
}

export function Years(startYear: number) {
  const currentYear: number = new Date().getFullYear();
  const years: string[] = [];
  for (let year = startYear; year <= currentYear - 1; year++) {
    years.push(year.toString());
  }
  return years;
}

export async function Timeout(ms: number) {
  return await new Promise((resolve) => setTimeout(resolve, Number(ms)));
}