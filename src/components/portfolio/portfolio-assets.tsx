import { db } from "@/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { getQuotes } from "@/lib/fmp/quote";
import { StockImage } from "../stock/stock-image";
import PortfolioAddModal from "./portfolio-add-modal";
import { Session } from "next-auth";
import { PortfolioWithStocks } from "@/types/db";

interface Props {
  symbols: string[];
  portfolio: PortfolioWithStocks;
  session: Session | null;
}

export default async function PortfolioAssets({
  symbols,
  portfolio,
  session,
}: Props) {
  const [stocks, quotes] = await Promise.all([
    db.stock.findMany({
      where: { symbol: { in: symbols } },
    }),
    getQuotes(symbols),
  ]);

  const results = stocks
    .map((stock) => ({
      ...stock,
      ...quotes?.find((q) => q.symbol === stock.symbol),
    }))
    .slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle>Assets</CardTitle>
            <CardDescription>Positions in your portfolio</CardDescription>
          </div>
          <PortfolioAddModal portfolio={portfolio} />
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
            {results.map((stock) => (
              <TableRow key={stock.symbol}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <StockImage src={stock.image} px={30} />
                    <div className="f-col">
                      <p className="font-medium">{stock.symbol}</p>
                      <p className="text-[13px] w-[80px] lg:w-[120px] truncate text-slate-400">
                        {stock.companyName}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="f-col justify-end items-center">
                    <p>${stock.price.toFixed(2)}</p>
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
                  {stock.peRatioTTM.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
