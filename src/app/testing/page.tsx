import dynamic from "next/dynamic";

const AreaChart = dynamic(() => import("@/components/area-chart"), {
  ssr: false,
});

export default function Testing() {
  return <AreaChart />;
}
