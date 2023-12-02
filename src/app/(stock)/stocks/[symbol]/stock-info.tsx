import Link from "next/link";
import { ChevronsDown, ChevronsUp } from "lucide-react";
import StockImage from "@/components/stock/stock-image";
import { db } from "@/db";
import { Card } from "@/components/ui/card";
import Skeleton, {
  SkeletonButton,
  SkeletonText,
} from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import { getUser } from "@/lib/auth";
import { StockQuote } from "@/types/stock";

const StockPortfolioAddModal = dynamic(
  () => import("@/components/stock/stock-portfolio-add-modal"),
  {
    ssr: false,
    loading: () => <SkeletonButton isIconOnly />,
  }
);

export function StockInfoLoading() {
  return (
    <Card className="f-col p-3 pb-1.5 gap-1">
      <div className="flex gap-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <SkeletonText />
      </div>
      <SkeletonText count={1} />
      <div className="absolute right-3 top-3 flex">
        <SkeletonButton isIconOnly />
      </div>
    </Card>
  );
}

interface Props {
  stockQuote: Pick<
    StockQuote,
    | "id"
    | "symbol"
    | "website"
    | "image"
    | "companyName"
    | "price"
    | "changesPercentage"
  >;
}

export default async function StockInfo({ stockQuote }: Props) {
  const user = await getUser();

  const portfolios = await db.portfolio.findMany({
    select: {
      id: true,
      title: true,
      isPublic: true,
      color: true,
      stocks: {
        select: { stockId: true },
      },
    },
    where: { creatorId: user?.id },
  });

  const positive = stockQuote?.changesPercentage >= 0;

  return (
    <Card className="f-col p-3 pb-1.5 gap-1">
      <div className="flex gap-2">
        <Link href={stockQuote.website} prefetch={false} target="_blank">
          <StockImage src={stockQuote.image} px={40} />
        </Link>
        <div className="-space-y-1">
          <p className="mr-10 w-[200px] truncate text-[17px] font-medium">
            {stockQuote.symbol}
          </p>
          <p className="text-zinc-400 text-[13px]">{stockQuote.companyName}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 px-2">
        <div className="flex items-center gap-[1px]">
          <span className="text-lg mb-[1px]">$</span>
          <p className="text-[26px]">{stockQuote?.price?.toFixed(2)}</p>
        </div>
        {positive ? (
          <ChevronsUp className="h-5 w-5 mt-1 text-green-500" />
        ) : (
          <ChevronsDown className="h-5 w-5 mt-1 text-red-500" />
        )}
        <p
          className={`text-lg mt-1.5 ${
            positive ? "text-green-500" : "text-red-500"
          }`}>
          ({positive && "+"}
          {stockQuote?.changesPercentage?.toFixed(2) + "%"})
        </p>
      </div>
      <div className="absolute right-3 top-3 flex">
        <StockPortfolioAddModal
          isAuth={!!user}
          stock={stockQuote}
          portfolios={portfolios}
        />
      </div>
    </Card>
  );
}
