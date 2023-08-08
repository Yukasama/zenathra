import { searchStocks } from "@/lib/stocks/client/getStocks";
import { Stock } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";

interface Props {
  search: string;
}

export default async function SearchResults({ search }: Props) {
  if (!search) return <p>No Results found.</p>;

  const stocks = await searchStocks(search);
  if (!stocks) return <p>No Results found.</p>;

  return (
    <div className="f-col gap-1.5">
      {stocks.map((stock: Stock) => (
        <Link
          href={`/stocks/${stock.symbol}`}
          key={stock.symbol}
          className="grid h-[60px] grid-cols-3 items-center gap-4 bg-gray-200 px-4 dark:bg-moon-200 dark:hover:bg-moon-400">
          <div className="grid-col-span-1 flex items-center gap-4">
            <div className="f-box h-10 w-10 rounded-sm">
              <Image
                src={stock.image}
                className="max-h-10 w-10 rounded-md p-1"
                height={30}
                width={30}
                alt="Logo"
                loading="lazy"
              />
            </div>
            <div className="f-col">
              <p className="font-medium">{stock.symbol}</p>
              <p className="text-sm text-gray-700">{stock.companyName}</p>
            </div>
          </div>
          <div className="rounded-md bg-blue-500 p-1.5 text-sm text-white">
            Technology
          </div>
          <div className="rounded-md bg-green-500 p-1.5 text-sm text-white">
            +0,49%
          </div>
        </Link>
      ))}
    </div>
  );
}
