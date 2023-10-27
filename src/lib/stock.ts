import "server-only";

// import { History } from "@/types/stock";

// export async function getTar(symbol: string) {
//   try {
//     const { data } = await fetch(symbol, "All").then((res) => res.json());
//     const history: History[] = data;

//     const close: number[] = history.map((h: History) => h.close);

//     const y1 = close.pop()! / close[0];
//   } catch {
//     return null;
//   }
// }
