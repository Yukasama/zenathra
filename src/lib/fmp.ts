import { fmpConfig, fmpUrls } from "@/config/fmp";
import { StockAction } from "@/types/stock";

export async function getDailys(action: StockAction) {
  try {
    if (fmpConfig.simulation) return ["AAPL", "MSFT", "GOOG", "TSLA", "NVDA"];

    const response = await fetch(fmpUrls[action]).then((res) => res.json());

    // Filtering all ETFs and stocks with "-" in their symbol
    const symbols = response
      .filter(
        (item: any) =>
          item.name &&
          !item.symbol.includes("-") &&
          !item.name.includes("ProShares")
      )
      .map((item: any) => item.symbol);

    return symbols;
  } catch {
    return null;
  }
}
