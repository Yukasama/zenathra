import { Stock } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";

interface Props {
  results: Stock[];
}

export default async function SearchResults({ results }: Props) {
  return (
    <div className="f-col gap-1.5">
      {results.map((stock: Stock) => (
        <Link
          href={`/stocks/${stock.symbol}`}
          key={stock.symbol}
          className="grid h-[60px] grid-cols-3 items-center gap-4 bg-slate-200 px-4 dark:bg-moon-200 dark:hover:bg-moon-400">
          <div className="grid-col-span-1 flex items-center gap-4">
            <div className="f-box h-10 w-10 rounded-sm">
              <Image
                src={stock.image || "/images/stock.jpg"}
                className="max-h-10 w-10 rounded-md p-1"
                height={30}
                width={30}
                alt="Company Logo"
                loading="lazy"
              />
            </div>
            <div className="f-col">
              <p className="font-medium">{stock.symbol}</p>
              <p className="text-sm text-slate-700">{stock.companyName}</p>
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
