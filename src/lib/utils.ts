import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Metadata } from "next";
import { SITE } from "@/config/site";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export function capitalize(text: string) {
  text.charAt(0).toUpperCase() + text.slice(1);
}

export async function Timeout(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
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
  const PORTFOLIO_COLORS = [
    "#FF6347",
    "#FFA07A",
    "#FFD700",
    "#FF8C00",
    "#DB7093",
  ];
  const randomIndex = Math.floor(Math.random() * PORTFOLIO_COLORS.length);

  return PORTFOLIO_COLORS[randomIndex];
}

export function generateName() {
  const adjectives = [
    "cool",
    "kind",
    "calm",
    "bold",
    "wise",
    "neat",
    "fair",
    "glad",
    "keen",
    "rare",
    "pure",
    "warm",
    "wild",
    "firm",
    "fast",
    "deep",
    "vast",
    "soft",
    "hard",
    "rich",
  ];

  const nouns = [
    "star",
    "rose",
    "wind",
    "flame",
    "wave",
    "stone",
    "leaf",
    "snow",
    "rain",
    "fire",
    "tree",
    "bird",
    "wolf",
    "bear",
    "lion",
    "fish",
    "frog",
    "hawk",
    "dear",
    "moon",
  ];

  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const numbers = Math.floor(Math.random() * 90000 + 1000).toString();

  return `${adjective}-${noun}-${numbers}`;
}
