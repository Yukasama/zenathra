import { cn } from "@/lib/utils";
import Image from "next/image";

interface Props extends React.HTMLAttributes<HTMLImageElement> {
  px: number;
  src: string | null | undefined;
  priority?: boolean;
}

export function StockImage({ px, src, className, priority = false }: Props) {
  return (
    <div className="f-box">
      <Image
        className={cn(className, "rounded-full")}
        src={src ?? "/images/stock.jpg"}
        height={px}
        width={px}
        alt="Company Logo"
        loading={`${priority ? "eager" : "lazy"}`}
        priority={priority}
      />
    </div>
  );
}
