import Link from "next/link";
import Image from "next/image";
import { Quote, StockImage } from "@/types/stock";
import { StructureProps } from "@/types/layout";

interface SharedProps {
  className?: string;
}

interface Props extends SharedProps {
  symbol: string;
  image: StockImage | null | undefined;
  quote: Quote | null;
}

function Structure({ children, className, isLoading }: StructureProps) {
  return (
    <div
      className={`mb-1 flex h-[50px] items-center justify-between gap-3 rounded-md p-3 pl-2 ${
        isLoading
          ? "animate-pulse-right"
          : "bg-gray-100 hover:bg-gray-300 dark:bg-moon-300 dark:hover:bg-moon-200"
      } ${className}`}>
      {children}
    </div>
  );
}

export function ListItemLoading({ className }: SharedProps) {
  return <Structure isLoading className={className} />;
}

export default function ListItem({ symbol, image, quote, className }: Props) {
  const pos = quote ? (quote.change > 0 ? true : false) : true;

  return (
    <Link href={`/stocks/${symbol}`}>
      <Structure className={className}>
        <div className="f-box gap-3">
          <div className="image h-[40px] w-[40px]">
            <Image
              src={image ? image.image : "/images/stock.jpg"}
              height={40}
              width={40}
              alt="Company Logo"
              loading="lazy"
            />
          </div>
          <div>
            <p className="text-sm">{symbol}</p>
            <p className="text-[12px] text-gray-500">
              {quote ? quote.name : "N/A"}
            </p>
          </div>
        </div>
        <div>
          <p className="text-end text-[12px]">
            ${quote && quote.price ? quote.price.toFixed(2) : "N/A"}
          </p>
          <p
            className={`text-end text-[12px] ${
              pos ? "text-green-500" : "text-red-500"
            }`}>
            {pos && "+"}
            {quote && quote.changesPercentage
              ? quote.changesPercentage.toFixed(2)
              : "N/A"}
            %
          </p>
        </div>
      </Structure>
    </Link>
  );
}
