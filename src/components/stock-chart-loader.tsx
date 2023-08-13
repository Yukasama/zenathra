import { StockPriceChart } from "@/components";
import { getAllHistory } from "@/lib/stock-get";

interface Props {
  symbol: string;
}

export default async function StockChartLoader({ symbol }: Props) {
  const history = await getAllHistory(symbol);

  return <StockPriceChart history={history} />;
}
