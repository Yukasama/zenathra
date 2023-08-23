import { cn } from "@/lib/utils";
import Image from "next/image";

interface Props extends React.HTMLAttributes<HTMLImageElement> {
  px: number;
  src: string;
}

export function StockImage({ px, src, className }: Props) {
  return (
    <Image
      className={cn(className, "rounded-md")}
      src={src || "/images/stock.jpg"}
      height={px}
      width={px}
      alt="Company Logo"
      loading="lazy"
    />
  );
}
