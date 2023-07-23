import { Quote, StockImage } from "@/types/stock";
import Image from "next/image";
import Link from "next/link";
import Price from "@/components/ui/stocks/Price";

interface Props {
  quote: Quote | null;
  image: StockImage | null | undefined;
}

export default function Card({ quote, image }: Props) {
  if (!quote || !quote.symbol)
    return (
      <div className="box flex-box h-[200px] w-[300px] min-w-[150px] rounded-xl shadow-md">
        <p className="text-lg font-medium text-gray-600">
          Stock Could Not Be Loaded
        </p>
      </div>
    );

  return (
    <Link
      href={`/stocks/${quote.symbol}`}
      className="group box relative flex h-[200px] w-[300px] min-w-[150px] cursor-pointer flex-col justify-between gap-1 p-3 transition-transform duration-[0.4s] hover:scale-[1.02]">
      <div className="f-col items-center gap-1 xl:flex-row">
        <div className="image h-9 w-9 rounded-md">
          <Image
            className="rounded-lg"
            src={image ? image.image : "/images/stock.jpg"}
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
          <div className="text-center text-[11px] text-gray-500 dark:text-gray-700 xl:text-left">
            {quote.symbol}
          </div>
        </div>
      </div>

      {/* <div className="px-2 py-1 rounded-md shadow-sm">
        <p className="text-[12px]">{stock?.sector || "N/A"}</p>
      </div> */}

      <Price quote={quote} />
    </Link>
  );
}
