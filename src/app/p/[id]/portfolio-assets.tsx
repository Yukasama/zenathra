import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { getQuotes } from "@/lib/fmp/quote";
import { StockImage } from "../../../components/stock/stock-image";
import { PortfolioWithStocks } from "@/types/db";
import type { KindeUser } from "@kinde-oss/kinde-auth-nextjs/server";
import dynamic from "next/dynamic";
import Skeleton from "../../../components/ui/skeleton";
import { Button, buttonVariants } from "../../../components/ui/button";
import { Pencil } from "lucide-react";
import type { Stock } from "@prisma/client";

const EditPositions = dynamic(() => import("./edit-positions"), {
  ssr: false,
  loading: () => <Button variant="subtle" isLoading />,
});

interface Props {
  stocks: Pick<
    Stock,
    "id" | "symbol" | "companyName" | "image" | "peRatioTTM"
  >[];
  portfolio: Pick<
    PortfolioWithStocks,
    "id" | "title" | "creatorId" | "public" | "createdAt" | "stocks"
  >;
  user: KindeUser | null;
}

export function PortfolioAssetsLoading() {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="f-col gap-1.5">
            <Skeleton>
              <CardTitle>Assets</CardTitle>
            </Skeleton>
            <Skeleton>
              <CardDescription>Positions in your portfolio</CardDescription>
            </Skeleton>
          </div>
          <Skeleton>
            <div className={buttonVariants()}>
              <Pencil className="h-4 w-4" />
              Edit
            </div>
          </Skeleton>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-14 w-full"></Skeleton>
        ))}
      </CardContent>
    </Card>
  );
}

export default async function PortfolioAssets({
  stocks,
  portfolio,
  user,
}: Props) {
  const quotes = await getQuotes(stocks.map((stock) => stock.symbol));

  const results = stocks.map((stock) => ({
    ...stock,
    ...quotes?.find((q) => q.symbol === stock.symbol),
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="f-col gap-1.5">
            <CardTitle>Assets</CardTitle>
            <CardDescription>Positions in your portfolio</CardDescription>
          </div>
          {portfolio.creatorId === user?.id && (
            <EditPositions stocks={stocks} portfolio={portfolio} />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>A list of your current positions.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px] lg:w-[160px]">Symbol</TableHead>
              <TableHead className="w-[110px] lg:w-[130px] text-center">
                Price (24h)
              </TableHead>
              <TableHead className="text-right">P/E (ttm)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results
              .slice(0, results.length > 5 ? 5 : results.length)
              .map((stock) => (
                <TableRow key={stock.symbol}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <StockImage src={stock.image} px={30} />
                      <div className="f-col">
                        <p className="font-medium">{stock.symbol}</p>
                        <p className="text-[13px] w-[80px] lg:w-[120px] truncate text-zinc-400">
                          {stock.companyName}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="f-col justify-end items-center">
                      <p>${stock.price ? stock.price.toFixed(2) : "N/A"}</p>
                      <p
                        className={`text-[13px] ${
                          stock.changesPercentage! > 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}>
                        {stock.changesPercentage! > 0 && "+"}
                        {stock.changesPercentage?.toFixed(2)}%
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {stock.peRatioTTM ? stock.peRatioTTM.toFixed(2) : "N/A"}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
