import { Quote } from "@/types/stock";
import Link from "next/link";
import StockPrice from "./stock-price";
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

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  quote: Quote | null;
  image: string | undefined;
}

export function StockCardLoading() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <div className="flex gap-3">
            <Skeleton>
              <div className="h-10 w-10"></div>
            </Skeleton>
            <div className="f-col gap-1">
              <Skeleton>
                <CardTitle className="w-[150px]">a</CardTitle>
              </Skeleton>
              <Skeleton>
                <CardDescription className="w-[200px]"></CardDescription>
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
              "text-blue-500 bg-slate-900"
            )}>
            a
          </div>
        </Skeleton>
        <Skeleton>
          <div
            className={cn(
              buttonVariants({ size: "xs" }),
              "text-blue-500 bg-slate-900"
            )}>
            a
          </div>
        </Skeleton>
      </CardContent>

      <CardFooter>
        <Skeleton>
          <div className="h-10 w-full">a</div>
        </Skeleton>
      </CardFooter>
    </Card>
  );
}

export default function StockCard({ quote, image, className }: Props) {
  if (!quote) return <Card className="f-box">Stock could not be loaded</Card>;

  return (
    <Link
      className="hover:scale-[1.01] transition duration-300"
      href={`/stocks/${quote.symbol}`}>
      <Card className={cn(className)}>
        <CardHeader>
          <div className="flex justify-between">
            <div className="flex gap-3">
              <StockImage src={image} px={40} priority />
              <div className="f-col gap-1">
                <CardTitle>{quote.symbol}</CardTitle>
                <CardDescription className="w-[190px] truncate">
                  {quote?.name}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex gap-3">
          <div
            className={cn(
              buttonVariants({ size: "xs" }),
              "text-blue-500 bg-slate-900"
            )}>
            Technology
          </div>
          <div
            className={cn(
              buttonVariants({ size: "xs" }),
              "text-blue-500 bg-slate-900"
            )}>
            Computer Devices
          </div>
        </CardContent>

        <CardFooter>
          <StockPrice className="w-full" quote={quote} />
        </CardFooter>
      </Card>
    </Link>
  );
}
