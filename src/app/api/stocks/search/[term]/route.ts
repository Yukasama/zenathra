import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { ArgumentError, NotFoundError } from "@/lib/errors";
import { z } from "zod";
import { Stock } from "@prisma/client";

const Schema = z.object({
  params: z.object({
    term: z.string().nonempty(),
  }),
});

export async function GET(req: NextRequest, rawParams: unknown) {
  try {
    const result = Schema.safeParse(rawParams);
    if (!result.success) throw new ArgumentError(result.error.message);
    const { term } = result.data.params;

    const allStocks = await db.stock.findMany();

    const stocks = simpleSearch(term, allStocks);

    if (!stocks) throw new NotFoundError("No stocks matching search found.");

    return NextResponse.json(stocks);
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: err.status || 500 }
    );
  }
}

function levenshteinDistance(a: string, b: string) {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

function getSimilarityScore(term: string, word: string) {
  return (
    1 - levenshteinDistance(term, word) / Math.max(term.length, word.length)
  );
}

function simpleSearch(term: string, stocks: Stock[]) {
  const threshold = 0.7;
  return stocks.filter((stock) => {
    const symbolScore = getSimilarityScore(term, stock.symbol);
    const nameScore = getSimilarityScore(term, stock.companyName);
    return symbolScore >= threshold || nameScore >= threshold;
  });
}
