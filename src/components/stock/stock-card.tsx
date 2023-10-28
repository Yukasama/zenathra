import { Quote } from "@/types/stock";
import Link from "next/link";
import StockPrice from "../../app/stocks/[symbol]/stock-price";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { StockImage } from "./stock-image";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import React from "react";
import Skeleton from "../ui/skeleton";
import SmallChart from "./small-chart";
import { Stock } from "@prisma/client";
import { PortfolioWithStocks } from "@/types/db";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  quote: Quote | null;
  stock: Pick<Stock, "id" | "symbol" | "image"> | undefined;
  isAuthenticated: boolean;
  portfolios:
    | Pick<
        PortfolioWithStocks,
        "id" | "title" | "color" | "stocks" | "public"
      >[]
    | undefined;
}

const StockPortfolioAddModal = dynamic(
  () => import("./stock-portfolio-add-modal"),
  {
    ssr: false,
    loading: () => (
      <div
        className={cn(
          buttonVariants({
            variant: "subtle",
            size: "xs",
          }),
          "opacity-50"
        )}>
        <Loader2 className="animate-spin h-4" />
      </div>
    ),
  }
);

export function StockCardLoading() {
  return (
    <Card className="min-w-[300px] min-h-[210px] lg:min-h-[250px]">
      <CardHeader>
        <div className="flex justify-between">
          <div className="flex gap-3">
            <Skeleton>
              <div className="h-10 w-10"></div>
            </Skeleton>
            <div className="f-col gap-1">
              <Skeleton>
                <CardTitle className="h-4 w-[150px]"></CardTitle>
              </Skeleton>
              <Skeleton>
                <CardDescription className="h-4 w-[200px]"></CardDescription>
              </Skeleton>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex gap-3">
        <Skeleton>
          <div
            className={cn(
              buttonVariants({ size: "xs" }),
              "text-primary bg-zinc-900"
            )}>
            Placeholder
          </div>
        </Skeleton>
        <Skeleton>
          <div
            className={cn(
              buttonVariants({ size: "xs" }),
              "text-primary bg-zinc-900"
            )}>
            Placeholder
          </div>
        </Skeleton>
      </CardContent>

      <CardFooter>
        <Skeleton>
          <div className="w-40 h-8"></div>
        </Skeleton>
      </CardFooter>
    </Card>
  );
}

export default function StockCard({
  quote,
  stock,
  isAuthenticated,
  portfolios,
  className,
}: Props) {
  if (!quote) return <Card className="f-box">Stock could not be loaded</Card>;

  return (
    <Card
      className={cn(
        className,
        "relative min-w-[300px] min-h-[210px] lg:min-h-[250px] overflow-hidden hover:scale-[1.01] transition duration-300 z-[1]"
      )}>
      {stock && (
        <div className="absolute top-4 right-4">
          <StockPortfolioAddModal
            isAuthenticated={isAuthenticated}
            symbolId={stock?.id}
            symbol={quote.symbol}
            portfolios={portfolios}
          />
        </div>
      )}
      <div className="absolute bottom-0 opacity-70 left-0 w-full -z-0 pointer-events-none">
        <SmallChart quote={quote} height={150} />
      </div>
      <Link
        href={`/stocks/${quote.symbol}`}
        className="h-full f-col justify-between">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <StockImage src={stock?.image} px={40} priority />
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
            priority={true}
          />
        )}
        <CardFooter>
          <StockPrice className="w-full" quote={quote} />
        </CardFooter>
      </Link>
    </Card>
  );
}
