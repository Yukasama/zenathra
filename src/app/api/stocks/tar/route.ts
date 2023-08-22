import { getHistory } from "@/lib/stock-get";
import { Stock } from "@prisma/client";
import { env } from "@/env.mjs";
import { History } from "@/types/stock";

export async function POST(req: Request) {
  const { stock } = await req.json();

  const history: History[] | null = await getHistory(stock.symbol, "ALL");

  if (!history) return null;

  const close: number[] = history.map((h: History) => h.close);

  const y1 = close.pop()! / close[0];
}
