import { cn } from "@/lib/utils";
import { ImageOff } from "lucide-react";
import Image from "next/image";

interface Props extends React.HTMLAttributes<HTMLImageElement> {
  src: string | null | undefined;
  px?: number;
}

export default function StockImage({
  src,
  px = 40,
  className,
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
      {src ? (
        <Image
          className={cn(
            `p-1 ${src.includes("AAPL") && "invert dark:invert-0"}`,
            className
          )}
          src={src}
          height={px}
          width={px}
          alt="Stock Logo"
        />
      ) : (
        <div
          style={{ height: px, width: px }}
          className="f-box p-3 rounded-full bg-zinc-300 dark:bg-zinc-700">
          <ImageOff size={22} />
        </div>
      )}
    </div>
  );
}
