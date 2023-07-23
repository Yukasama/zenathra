import { PriceChart } from "@/components/ui/charts";
import { getCombinedHistory } from "@/lib/stocks/client/getStocks";

interface Props {
  symbols: string[];
}

export default async function PortfolioChart({ symbols }: Props) {
  const history = await getCombinedHistory(symbols);

  return <PriceChart history={history} />;
}
