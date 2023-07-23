import rateLimit from "express-rate-limit";
import { NextRequest, NextResponse } from "next/server";

export const rateLimiter = (windowMs?: number, max?: number) =>
  rateLimit({
    windowMs: windowMs || 15 * 60 * 1000,
    max: max || 100,
    message: "Too many requests, please try again later.",
  });

export function nextConnect(
  req: NextRequest,
  res: NextResponse,
  middleware: any
) {
  return new Promise((resolve, reject) => {
    middleware(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}
