import { Quote } from "@/types/stock";
import Link from "next/link";
import StockPrice from "../../app/(stock)/stocks/[symbol]/stock-price";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import StockImage from "./stock-image";
import { cn } from "@/lib/utils";
import Skeleton, { SkeletonButton, SkeletonText } from "../ui/skeleton";
import { Stock } from "@prisma/client";
import { PortfolioWithStocks } from "@/types/db";
import dynamic from "next/dynamic";
import { getUser } from "@/lib/auth";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  quote: Quote | undefined;
  stock: Pick<Stock, "id" | "symbol" | "image"> | undefined;
  portfolios:
    | Pick<
        PortfolioWithStocks,
        "id" | "title" | "color" | "stocks" | "isPublic"
      >[]
    | undefined;
}

const StockPortfolioAddModal = dynamic(
  () => import("./stock-portfolio-add-modal"),
  {
    ssr: false,
    loading: () => <SkeletonButton isIconOnly />,
  }
);

const SmallChart = dynamic(() => import("./small-chart"), {
  ssr: false,
  loading: () => <Skeleton className="h-20" />,
});

export function StockCardLoading() {
  return (
    <Card className="min-w-[300px] min-h-[210px] lg:min-h-[250px]">
      <CardHeader>
        <div className="flex justify-between">
          <div className="flex gap-3">
            <Skeleton>
              <div className="h-10 w-10"></div>
            </Skeleton>
            <SkeletonText />
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex gap-3">
        <SkeletonButton />
        <SkeletonButton />
      </CardContent>

      <CardFooter>
        <Skeleton>
          <div className="w-40 h-8"></div>
        </Skeleton>
      </CardFooter>
    </Card>
  );
}

export default async function StockCard({
  quote,
  stock,
  portfolios,
  className,
}: Props) {
  if (!quote) {
    return <Card className="f-box">Stock could not be loaded</Card>;
  }

  const user = await getUser();

  return (
    <Card
      className={cn(
        className,
        "relative min-w-[300px] min-h-[210px] lg:min-h-[250px] overflow-hidden hover:scale-[1.01] transition duration-300 z-[1]"
      )}>
      {/* Modal to add stocks to portfolio */}
      {stock && (
        <div className="absolute top-4 right-4">
          <StockPortfolioAddModal
            stock={stock}
            portfolios={portfolios}
            isAuth={!!user}
          />
        </div>
      )}

      {/* Background chart */}
      <div className="absolute bottom-0 opacity-70 left-0 w-full -z-0 pointer-events-none">
        <SmallChart quote={quote} height={150} />
      </div>

      {/* Content */}
      <Link
        href={`/stocks/${quote.symbol}`}
        className="h-full f-col justify-between">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <StockImage src={stock?.image} px={40} />
              <div className="f-col gap-1">
                <CardTitle>{quote.symbol}</CardTitle>
                <CardDescription className="w-[190px] truncate">
                  {quote?.name}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        {stock && (
          <StockImage
            className="absolute -top-5 right-[5%] pointer-events-none opacity-20 aria-hidden"
            src={stock.image}
            px={350}
          />
        )}

        <CardFooter>
          <StockPrice className="w-full" quote={quote} />
        </CardFooter>
      </Link>
    </Card>
  );
}
