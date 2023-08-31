"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { ColorTheme } from "react-ts-tradingview-widgets";

const AdvancedRealTimeChart = dynamic(
  () =>
    import("react-ts-tradingview-widgets").then((w) => w.AdvancedRealTimeChart),
  { ssr: false }
);

export default function Page() {
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
