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

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  quote: Quote | null;
  image: string | undefined;
}

export default function StockCard({ quote, image, className }: Props) {
  if (!quote) return <div className="animate-pulse-right h-40 w-80"></div>;

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
          {quote.symbol === "NVOS" && (
            <div
              className={cn(
                buttonVariants({ size: "xs" }),
                "text-blue-400 bg-gradient-radial from-blue-500/30 to-slate-900"
              )}>
              SOtd
            </div>
          )}
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
          <StockPrice quote={quote} />
        </CardFooter>
      </Card>
    </Link>
  );
}
