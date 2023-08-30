import StockPriceChart from "./stock-price-chart";
import { StockHistoryProps } from "@/lib/validators/stock";
import axios from "axios";

interface Props {
  symbol: string;
}

export default async function StockChartLoader({ symbol }: Props) {
  const payload: StockHistoryProps = {
    symbol,
    range: "ALL",
  };

  const history = await axios.post("/api/stock/history", payload);

  return <StockPriceChart data={history} />;
}
