import { History } from "@/types/stock";
import { getHistory } from "@/lib/stocks/client/getStocks";
import { Stock } from "@prisma/client";

export async function getTAR(stock: Stock) {
  const history: History[] | null = await getHistory(stock.symbol, "ALL");

  if (!history) return null;

  const close: number[] = history.map((h: History) => h.close);

  const y1 = close.pop()! / close[0];
}
