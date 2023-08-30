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
} from "./ui/card";
import { StockImage } from "./shared/stock-image";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import React from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  quote: Quote | null;
  image: string | undefined;
}

export default function StockCard({ quote, image, className }: Props) {
  if (!quote) return <div className="flex">Stock could not be loaded</div>;

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
                <CardDescription>{quote?.name}</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex gap-3">
          <div
            className={cn(buttonVariants({ variant: "subtle", size: "sm" }))}>
            Technology
          </div>
          <div
            className={cn(buttonVariants({ variant: "subtle", size: "sm" }))}>
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
