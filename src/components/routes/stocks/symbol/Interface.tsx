import Link from "next/link";
import Image from "next/image";
import { ChevronsUp, ChevronsDown } from "react-feather";
import Like from "@/components/ui/stocks/Like";
import { Quote } from "@/types/stock";
import { Stock } from "@prisma/client";
import { Portfolio } from "@/types/portfolio";
import { User } from "@/types/user";
import { getPortfolios } from "@/lib/portfolio/getPortfolio";
import { getQuote } from "@/lib/stocks/client/getStocks";
import { StructureProps } from "@/types/layout";

interface InterfaceStructureProps extends StructureProps {
  children2: React.ReactNode;
}

interface Props {
  user: User | null;
  stock: Stock;
}

function Structure({
  className,
  isLoading,
  children,
  children2,
}: InterfaceStructureProps) {
  <div className="relative f-col gap-2">
    <div className="animate-pulse-right flex h-[90px] w-[350px] animate-appear-up items-center gap-3 rounded-lg bg-gray-200 p-2 px-4 dark:bg-moon-400">
      {children}
    </div>
    <div className="animate-pulse-right flex h-[40px] w-[350px] items-center gap-1 rounded-lg bg-gray-200 p-2 px-4 dark:bg-moon-400">
      {children2}
    </div>
  </div>;
}

export const InterfaceLoading = () => {
  return (
<Structure className={className} />
  );
};

export default async function Interface({ user, stock }: Props) {
  const [quote, portfolios]: [Quote | null, Portfolio[] | null] =
    await Promise.all([
      getQuote(stock.symbol),
      user ? getPortfolios(user.id) : null,
    ]);

  const positive: boolean =
    quote && quote.change ? (quote.change > 0 ? true : false) : true;

  return (
    <div className="relative f-col gap-2">
      <div className="flex h-[90px] w-[350px] animate-appear-up items-center gap-3 rounded-lg bg-gray-200 p-2 px-4 dark:bg-moon-400">
        <div className="image h-[50px] w-[50px]">
          <Link prefetch={false} href={stock.website || ""} target="_blank">
            <Image
              className="rounded-md"
              src={stock.image || "/images/stock.jpg"}
              height={50}
              width={50}
              alt="Company Logo"
              loading="lazy"
            />
          </Link>
        </div>
        <div className="f-col">
          <p className="mr-10 w-[200px] truncate text-[22px] font-medium">
            {stock.companyName}
          </p>
          <div className="flex items-end gap-1">
            <p className="text-[20px]">
              ${quote && quote.price ? quote.price.toFixed(2) : "N/A"}
            </p>
            <p
              className={`text-[17px] ${
                positive ? "text-green-500" : "text-red-500"
              }`}>
              {positive ? "+" : ""}
              {quote && quote.change ? quote.change.toFixed(2) : "N/A"}
            </p>
            <p
              className={`text-[17px] ${
                positive ? "text-green-500" : "text-red-500"
              }`}>
              (
              {quote && quote.changesPercentage
                ? quote.changesPercentage.toFixed(2) + "%"
                : "N/A"}
              )
            </p>
            {positive ? (
              <ChevronsUp className="mt-1 h-6 w-6 text-green-500" />
            ) : (
              <ChevronsDown className="mt-2 h-6 w-6 text-red-500" />
            )}
          </div>
        </div>
      </div>
      <div className="absolute right-2.5 top-2.5 flex">
        <Like user={user} symbol={stock.symbol} portfolios={portfolios} />
      </div>
      <div className="flex h-[40px] w-[350px] items-center gap-1 rounded-lg bg-gray-200 p-2 px-4 dark:bg-moon-400">
        <p className="mr-0.5 text-[15px] text-moon-100 dark:text-gray-400">
          After Hours:
        </p>
        <p className="text-[16px]">
          ${quote && quote.price ? quote.price.toFixed(2) : "N/A"}
        </p>
        <p
          className={`text-[15px] ${
            positive ? "text-green-500" : "text-red-500"
          }`}>
          ({positive ? "+" : ""}
          {quote && quote.changesPercentage
            ? quote.changesPercentage.toFixed(2) + "%"
            : "N/A"}
          )
        </p>
        {positive ? (
          <ChevronsUp className="mt-0.5 h-5 w-5 text-green-500" />
        ) : (
          <ChevronsDown className="mt-0.5 h-5 w-5 text-red-500" />
        )}
      </div>
    </div>
  );
}
