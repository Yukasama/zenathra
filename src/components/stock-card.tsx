import { Quote } from "@/types/stock";
import Image from "next/image";
import Link from "next/link";
import StockPrice from "./stock-price";
import { StructureProps } from "@/types/layout";

interface SharedProps {
  className?: string;
}
interface Props extends SharedProps {
  quote: Quote | null;
  image: string | undefined;
}

function Structure({ className, isLoading, children }: StructureProps) {
  return (
    <div
      className={`${
        isLoading && "animate-pulse-right"
      } box f-box h-[200px] w-[300px] min-w-[150px] shadow-md ${className}`}>
      {children}
    </div>
  );
}

export function StockCardLoading({ className }: SharedProps) {
  return <Structure className={className} isLoading />;
}

export default function StockCard({ quote, image, className }: Props) {
  if (!quote || !quote.symbol)
    return (
      <Structure>
        <p className="text-lg font-medium text-slate-600">
          Stock Could Not Be Loaded
        </p>
      </Structure>
    );

  return (
    <Structure className={className}>
      <Link
        className="h-full w-full f-col justify-between gap-1 p-3 transition-transform duration-500 hover:scale-[1.02]"
        href={`/stocks/${quote.symbol}`}>
        <div className="f-col lg:flex-row items-center gap-1">
          <div className="image h-9 w-9 rounded-md">
            <Image
              className="rounded-lg"
              src={image ?? "/images/stock.jpg"}
              height={36}
              width={36}
              alt={quote.symbol + "Image"}
              loading="lazy"
            />
          </div>
          <div className="f-col">
            <div className="w-[130px] truncate text-center text-[14px] font-normal xl:w-[200px] xl:text-left xl:text-[16px] xl:font-medium">
              {quote.name}
            </div>
            <div className="text-center text-[11px] text-slate-500 dark:text-slate-700 xl:text-left">
              {quote.symbol}
            </div>
          </div>
        </div>

        {/* <div className="px-2 py-1 rounded-md shadow-sm">
        <p className="text-[12px]">{stock?.sector || "N/A"}</p>
      </div> */}

        <StockPrice quote={quote} />
      </Link>
    </Structure>
  );
}
