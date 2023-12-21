"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Chip,
  Pagination,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { ArrowBigDown, ArrowBigUp, MoveDown, Search } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  SkeletonText,
  SkeletonButton,
  SkeletonList,
} from "@/components/ui/skeleton";
import { StockQuote } from "@/types/stock";
import StockImage from "@/components/stock/stock-image";
import { formatMarketCap } from "@/lib/utils";
import { Input } from "@nextui-org/react";
import Link from "next/link";

interface Props {
  stockQuotes: Pick<
    StockQuote,
    | "id"
    | "symbol"
    | "companyName"
    | "image"
    | "sector"
    | "price"
    | "changesPercentage"
    | "mktCap"
  >[];
}

export function LandingTableLoading() {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <SkeletonText />
          <SkeletonButton />
        </div>
      </CardHeader>
      <CardContent>
        <SkeletonList />
      </CardContent>
    </Card>
  );
}

const columnTranslation: any = {
  rank: "#",
  symbol: "Name",
  price: "Price",
  "24h %": "24h %",
  mktCap: "Market Cap",
  sector: "Sector",
};

export default function LandingTable({ stockQuotes }: Props) {
  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(1);

  const ROWS_PER_PAGE = 20;
  const COLUMNS = ["rank", "symbol", "price", "24h %", "mktCap", "sector"];

  // Filtering and sorting stocks
  const filteredStocks = useMemo(() => {
    return stockQuotes
      .filter((stock) =>
        stock.companyName.toLowerCase().includes(filterValue.toLowerCase())
      )
      .sort((a, b) => b.mktCap - a.mktCap);
  }, [stockQuotes, filterValue]);

  // Slicing stocks for pagination
  const paginatedStocks = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    const end = start + ROWS_PER_PAGE;
    return filteredStocks.slice(start, end).map((stock, index) => ({
      ...stock,
      rank: start + index + 1,
    }));
  }, [filteredStocks, page, ROWS_PER_PAGE]);

  // Single cell for assets table
  const renderCell = (stock: StockQuote, columnKey: string) => {
    switch (columnKey) {
      case "rank":
        return <p className="font-semibold text-zinc-400 w-3">{stock.rank}</p>;
      case "symbol":
        return (
          <div className="flex items-center gap-3">
            <StockImage src={stock.image} px={35} />
            <div>
              <p className="font-semibold">{stock.symbol}</p>
              <p className="text-[13px] text-zinc-500 max-w-[150px] truncate">
                {stock.companyName}
              </p>
            </div>
          </div>
        );
      case "price":
        return (
          <div>
            <p className="font-semibold">${stock.price?.toFixed(2)}</p>
          </div>
        );
      case "24h %":
        return (
          <div className="font-semibold flex items-center gap-1">
            {stock.changesPercentage > 0 ? (
              <ArrowBigUp
                size={16}
                className="text-green-500 dark:text-green-400"
              />
            ) : (
              <ArrowBigDown
                size={16}
                className="text-red-500 dark:text-red-400"
              />
            )}
            <span
              className={`${
                stock.changesPercentage > 0
                  ? "text-green-500 dark:text-green-400"
                  : "text-red-500 dark:text-red-400"
              }`}>
              {stock.changesPercentage?.toFixed(2).replace("-", "")}%
            </span>
          </div>
        );
      case "mktCap":
        return <p className="font-semibold">{formatMarketCap(stock.mktCap)}</p>;
      case "sector":
        return (
          <Chip color="primary" size="sm" variant="dot">
            {stock[columnKey]}
          </Chip>
        );
      default:
        return null;
    }
  };

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex justify-between items-end">
        <Input
          isClearable
          placeholder="Search by name..."
          className="w-60"
          size="sm"
          value={filterValue}
          onClear={() => onClear()}
          startContent={<Search size={18} aria-label="Search" />}
          onChange={(e) => setFilterValue(e.target.value)}
        />
      </div>
    );
  }, [filterValue, onClear]);

  const bottomContent = useMemo(() => {
    return (
      <Pagination
        className="mt-2 self-center"
        total={Math.ceil(filteredStocks.length / ROWS_PER_PAGE)}
        page={page}
        onChange={setPage}
      />
    );
  }, [filteredStocks, page, ROWS_PER_PAGE]);

  return (
    <div className="f-col gap-4 w-full">
      <Table
        aria-label="Assets Table"
        topContent={topContent}
        topContentPlacement="outside"
        bottomContent={bottomContent}>
        <TableHeader>
          {COLUMNS.map((column) => (
            <TableColumn key={column} className="text-sm">
              {columnTranslation[column]}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody emptyContent={"No stocks found"}>
          {paginatedStocks.map((stock) => (
            <TableRow
              key={stock.id + "1"}
              as={Link}
              href={`/stocks/${stock.symbol}`}
              className="hover:bg-zinc-100/50 border-b-1 dark:hover:bg-zinc-800/50 cursor-pointer">
              {COLUMNS.map((column) => (
                <TableCell key={column}>{renderCell(stock, column)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
