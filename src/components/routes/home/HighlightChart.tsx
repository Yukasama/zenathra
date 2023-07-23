import { PriceChart } from "@/components/ui/charts";
import { getHistory } from "@/lib/stocks/client/getStocks";

interface Props {
  symbol: string;
  className: string;
}

export default async function HighlightChart({ symbol, className }: Props) {
  const history = await getHistory(symbol, "1D");

  return <PriceChart history={history} size="md" className={className} />;
}
