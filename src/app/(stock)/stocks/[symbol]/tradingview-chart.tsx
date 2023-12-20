"use client";

import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import type { ColorTheme } from "react-ts-tradingview-widgets";

const AdvancedRealTimeChart = dynamic(
  () =>
    import("react-ts-tradingview-widgets").then((w) => w.AdvancedRealTimeChart),
  { ssr: false }
);

export default function TradingViewChart() {
  const { theme } = useTheme();

  return (
    <div>
      <AdvancedRealTimeChart
        theme={theme as ColorTheme}
        symbol="MSFT"
        interval="D"
        hide_side_toolbar
        withdateranges={false}
        hide_legend
        allow_symbol_change
        enable_publishing={false}
      />
    </div>
  );
}
