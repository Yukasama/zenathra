import { StockPriceChart } from "@/components";
import { db } from "@/lib/db";
import { StockHistoryProps } from "@/lib/validators/stock";
import axios from "axios";

interface Props {
  stockIds: string[];
}

export default async function PortfolioChart({ stockIds }: Props) {
  const symbols = await db.stock.findMany({
    select: { symbol: true },
    where: { id: { in: stockIds } },
  });

  const payload: StockHistoryProps = {
    symbol: symbols.map((s) => s.symbol),
    range: "Everything",
  };

  const { data } = await axios.post("/api/stock/history", payload);

  return <StockPriceChart history={data} />;
}
