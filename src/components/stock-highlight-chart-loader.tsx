import { StockPriceChart } from "@/components";
import { getHistory } from "@/lib/stock-get";

interface Props {
  symbol: string;
  className: string;
}

export default async function StockHighlightChartLoader({
  symbol,
  className,
}: Props) {
  const history = await getHistory(symbol, "1D");

  return <StockPriceChart history={history} size="md" className={className} />;
}
