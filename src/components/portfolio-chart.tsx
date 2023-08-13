import { StockPriceChart } from "@/components";
import { getCombinedHistory } from "@/lib/stock-get";

interface Props {
  symbols: string[];
}

export default async function PortfolioChart({ symbols }: Props) {
  const history = await getCombinedHistory(symbols);

  return <StockPriceChart history={history} />;
}
