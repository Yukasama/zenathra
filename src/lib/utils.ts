import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Metadata } from "next";
import { SITE } from "@/config/site";
import { NAME_ADJECTIVES, NAME_NOUNS } from "@/config/generate-name";
import { PORTFOLIO_COLORS } from "@/config/colors";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function getPercentage(count: number, total: number) {
  return `${((count / total) * 100).toFixed(2)}%`;
}

export async function Timeout(ms: number) {
  return await new Promise((resolve) => setTimeout(resolve, ms));
}

export function absoluteUrl(path: string) {
  if (typeof window !== "undefined") {
    return path;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}${path}`;
  }

  return `http://localhost:${process.env.PORT ?? 3000}${path}`;
}

export function computeDomain(data: any[]) {
  const values = data.map((item) => parseFloat(item.uv));
  const dataMax = Math.max(...values);
  const dataMin = Math.min(...values);
  const padding = (dataMax - dataMin) * 0.05; // 5% padding

  return [
    Number((dataMin - padding).toFixed(2)),
    Number((dataMax + padding).toFixed(2)),
  ];
}

export function constructMetadata(): Metadata {
  return {
    title: {
      default: SITE.name,
      template: `%s | ${SITE.name}`,
    },
    description: SITE.description,
    openGraph: {
      title: SITE.name,
      description: SITE.description,
      images: [{ url: "/logo.png" }],
    },
    icons: "/favicon.ico",
    metadataBase: new URL(SITE.url),
  };
}

export function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * PORTFOLIO_COLORS.length);

  return PORTFOLIO_COLORS[randomIndex];
}

export function generateName() {
  const adjective =
    NAME_ADJECTIVES[Math.floor(Math.random() * NAME_ADJECTIVES.length)];
  const noun = NAME_NOUNS[Math.floor(Math.random() * NAME_NOUNS.length)];
  const numbers = Math.floor(Math.random() * 90000 + 1000).toString();

  return `${adjective}-${noun}-${numbers}`;
}
