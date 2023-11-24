import { cn } from "@/lib/utils";
import { ImageOff } from "lucide-react";
import Image from "next/image";

interface Props extends React.HTMLAttributes<HTMLImageElement> {
  px?: number;
  src: string | null | undefined;
  priority?: boolean;
}

export default function StockImage({
  px = 40,
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
          loading={`${priority ? "eager" : "lazy"}`}
          priority={priority}
        />
      ) : (
        <div
          style={{ height: px, width: px }}
          className="f-box p-3 rounded-full bg-zinc-300 dark:bg-zinc-700">
          <ImageOff className="h-5 w-5" />
        </div>
      )}
    </div>
  );
}
