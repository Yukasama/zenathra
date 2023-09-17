import { env } from "@/env.mjs";

function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  if (env.NEXT_PUBLIC_VERCEL_URL) return `https://undefined`;
  return "http://127.0.0.1:3000";
}

export function getUrl() {
  return getBaseUrl() + "/api/trpc";
}
