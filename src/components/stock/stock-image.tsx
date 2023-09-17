import { cn } from "@/lib/utils";
import Image from "next/image";

interface Props extends React.HTMLAttributes<HTMLImageElement> {
  px: number;
  src: string | null | undefined;
  priority?: boolean;
}

export function StockImage({
  px,
  src,
  className,
  priority = false,
  ...props
}: Props) {
  return (
    <div
      className={cn("f-box rounded-full", className)}
      style={{
        width: px,
        height: px,
      }}
      {...props}>
      <Image
        className={cn("p-1", className)}
        src={src ?? "/stock.jpg"}
        height={px}
        width={px}
        alt="Stock Logo"
        loading={`${priority ? "eager" : "lazy"}`}
        priority={priority}
      />
    </div>
  );
}
