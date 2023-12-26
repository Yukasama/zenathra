"use client";

import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import type { ColorTheme } from "react-ts-tradingview-widgets";

const AdvancedRealTimeChart = dynamic(
  () =>
    import("react-ts-tradingview-widgets").then((w) => w.AdvancedRealTimeChart),
  { ssr: false }
);

interface Props {
  symbol: string;
}

export default function TradingViewChart({ symbol }: Props) {
  const { theme } = useTheme();

  return (
    <div>
      <AdvancedRealTimeChart
        theme={theme as ColorTheme}
        symbol={symbol}
        interval="D"
        withdateranges={false}
        autosize
        hide_legend
        hide_side_toolbar
        // backgroundColor={theme === "dark" ? "#18181b" : "#fff"}
        enable_publishing={false}
      />
    </div>
  );
}
