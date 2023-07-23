import { PriceChart } from "@/components/ui/charts";
import { getAllHistory } from "@/lib/stocks/client/getStocks";

interface Props {
  symbol: string;
}

export default async function StockChart({ symbol }: Props) {
  const history = await getAllHistory(symbol);

  return <PriceChart history={history} />;
}
