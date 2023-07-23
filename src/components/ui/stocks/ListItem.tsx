import Link from "next/link";
import Image from "next/image";
import { Quote, StockImage } from "@/types/stock";

interface Props {
  symbol: string;
  image: StockImage | null | undefined;
  quote: Quote | null;
  className?: string;
}

export default function ListItem({ symbol, image, quote, className }: Props) {
  const pos = quote ? (quote.change > 0 ? true : false) : true;

  return (
    <Link
      href={`/stocks/${symbol}`}
      className={`${className} mb-1 flex h-[50px] w-full items-center justify-between gap-3 rounded-md bg-gray-100 p-3 
        pl-2 hover:bg-gray-300 dark:bg-moon-300 dark:hover:bg-moon-200`}>
      <div className="flex items-center gap-3">
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
    </Link>
  );
}
