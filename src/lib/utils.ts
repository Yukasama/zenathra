import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Metadata } from "next";
import { SITE } from "@/config/site";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const Timeout = async (ms: number) =>
  await new Promise<void>((resolve) => setTimeout(resolve, ms));

export function absoluteUrl(path: string) {
  if (typeof window !== "undefined") return path;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}${path}`;
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

export function constructMetadata({
  title = SITE.name,
  description = SITE.description,
  image = "/logo.png",
  icons = "/favicon.ico",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image }],
    },
    icons,
    metadataBase: new URL("https://www.zenethra.com"),
    themeColor: "#FFF",
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

export function getRandomColor(): string {
  const PORTFOLIO_COLORS = [
    "#0088FE",
    "#00C49F",
    "#A463F2",
    "#20B2AA",
    "#7C4DFF",
  ];
  const randomIndex = Math.floor(Math.random() * PORTFOLIO_COLORS.length);
  return PORTFOLIO_COLORS[randomIndex];
}