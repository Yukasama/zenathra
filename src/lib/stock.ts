import "server-only";

import { History } from "@/types/stock";
import axios from "axios";

export async function getTar(symbol: string) {
  try {
    const { data } = await axios.post(symbol, "ALL");
    const history: History[] = data;

    const close: number[] = history.map((h: History) => h.close);

    const y1 = close.pop()! / close[0];
  } catch {
    return null;
  }
}
