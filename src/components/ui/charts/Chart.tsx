import { StructureProps } from "@/types/layout";
import {
  Chart as Chartjs,
  LinearScale,
  Filler,
  CategoryScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

Chartjs.register(
  LinearScale,
  CategoryScale,
  Filler,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

interface ChartStructureProps extends StructureProps {
  size?: "lg" | "md" | "sm";
}

interface SharedProps {
  size?: "lg" | "md" | "sm";
  className?: string;
}

interface Props extends SharedProps {
  title: string | undefined;
  labels: string[];
  data: any;
  children: React.ReactNode;
}

export function ChartStructure({
  size = "lg",
  className,
  isLoading,
  children,
}: ChartStructureProps) {
  return (
    <div
      className={`${
        size === "lg"
          ? "h-[410px] w-[700px]"
          : size === "md"
          ? "h-[310px] w-[510px]"
          : "h-[190px] w-[300px]"
      } ${isLoading && "animate-pulse-right"} f-col wrapper ${className}`}>
      {children}
    </div>
  );
}

export function ChartLoading({ size = "lg", className }: ChartStructureProps) {
  return <ChartStructure size={size} className={className} isLoading />;
}

export default function Chart({
  title,
  size = "lg",
  className,
  data,
  children,
}: Props) {
  return (
    <ChartStructure size={size} className={className}>
      <p className="mb-1 text-[19px] font-medium">{title}</p>
      <div className="ml-0.5 flex gap-4">
        {data.map((c: any) => (
          <div key={title + c.label} className="flex items-center gap-[5px]">
            <div
              className={`h-[15px] w-[15px] rounded-full`}
              style={{
                backgroundColor: `rgb(${c.color.split(",")[0]}, ${
                  c.color.split(",")[1]
                }, ${c.color.split(",")[2]})`,
              }}></div>
            <p className="text-[14px] font-thin">{c.label}</p>
          </div>
        ))}
      </div>
      {children}
    </ChartStructure>
  );
}
