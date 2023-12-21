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
  SortDescriptor,
  Button,
  Select,
  SelectItem,
} from "@nextui-org/react";
import {
  ArrowBigDown,
  ArrowBigUp,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { StockQuote } from "@/types/stock";
import StockImage from "@/components/stock/stock-image";
import { formatMarketCap } from "@/lib/utils";
import { Input } from "@nextui-org/react";
import Link from "next/link";
import { exchanges, sectors } from "@/config/screener/filters";
import { Separator } from "@/components/ui/separator";
import SmallChart from "@/components/stock/small-chart";

interface Props {
  stockQuotes: Pick<
    StockQuote,
    | "id"
    | "symbol"
    | "companyName"
    | "image"
    | "sector"
    | "exchange"
    | "price"
    | "changesPercentage"
    | "mktCap"
  >[];
}

const columnTranslation: any = {
  rank: "#",
  symbol: "Name",
  price: "Price",
  changesPercentage: "24h %",
  mktCap: "Market Cap",
  sector: "Sector",
  chart: "",
};

export default function LandingTable({ stockQuotes }: Props) {
  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [sector, setSector] = useState("");
  const [exchange, setExchange] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "mktCap",
    direction: "descending",
  });

  const COLUMNS = [
    "rank",
    "symbol",
    "price",
    "changesPercentage",
    "mktCap",
    "sector",
    "chart",
  ];

  // Filtering and sorting stocks
  const filteredStocks = useMemo(() => {
    const lowercaseFilterValue = filterValue.toLowerCase();

    return stockQuotes
      .filter((stock) => {
        const sectorMatch =
          sector === "" || sector === "Any" || stock.sector === sector;
        const exchangeMatch =
          exchange === "" || exchange === "Any" || stock.exchange === exchange;
        const searchMatch =
          stock.companyName.toLowerCase().includes(lowercaseFilterValue) ||
          stock.symbol.toLowerCase().includes(lowercaseFilterValue);

        return sectorMatch && exchangeMatch && searchMatch;
      })
      .sort((a, b) => b.mktCap - a.mktCap);
  }, [stockQuotes, filterValue, sector, exchange]);

  // Slicing stocks for pagination
  const paginatedStocks = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredStocks.slice(start, end).map((stock, index) => ({
      ...stock,
      rank: start + index + 1,
    }));
  }, [filteredStocks, page, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...paginatedStocks].sort((a: any, b: any) => {
      const first = a[sortDescriptor.column as keyof StockQuote] as number;
      const second = b[sortDescriptor.column as keyof StockQuote] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, paginatedStocks]);

  // Single cell for assets table
  const renderCell = useCallback((stock: StockQuote, columnKey: string) => {
    switch (columnKey) {
      case "rank":
        return <p className="font-semibold text-zinc-400">{stock.rank}</p>;
      case "symbol":
        return (
          <div className="flex items-center gap-3 py-1.5">
            <StockImage src={stock.image} px={30} />
            <div>
              <p className="font-semibold text-[15px]">{stock.symbol}</p>
              <p className="text-sm text-zinc-500 max-w-[150px] truncate">
                {stock.companyName}
              </p>
            </div>
          </div>
        );
      case "price":
        return (
          <div className="w-10">
            <p className="font-semibold">${stock.price?.toFixed(2)}</p>
          </div>
        );
      case "changesPercentage":
        return (
          <div className="font-semibold flex items-center gap-1">
            {stock.changesPercentage > 0 ? (
              <ArrowBigUp
                size={16}
                className="text-emerald-500 dark:text-emerald-400"
              />
            ) : (
              <ArrowBigDown size={16} className="text-red-500" />
            )}
            <span
              className={`${
                stock.changesPercentage > 0
                  ? "text-emerald-500 dark:text-emerald-400"
                  : "text-red-500"
              }`}>
              {stock.changesPercentage?.toFixed(2).replace("-", "")}%
            </span>
          </div>
        );
      case "mktCap":
        return <p className="font-semibold">{formatMarketCap(stock.mktCap)}</p>;
      case "sector":
        return (
          <Chip color="primary" size="sm">
            {stock[columnKey]}
          </Chip>
        );
      case "chart":
        return (
          <div className="w-[200px] f-box">
            <SmallChart quote={stock} height={50} />
          </div>
        );
      default:
        return null;
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="f-col gap-3">
        <div className="flex justify-between items-center gap-4">
          <Input
            isClearable
            placeholder="Search by name..."
            className="w-60"
            labelPlacement="outside"
            aria-label="Search"
            value={filterValue}
            onClear={() => onClear()}
            startContent={<Search size={18} aria-label="Search" />}
            onChange={(e) => setFilterValue(e.target.value)}
          />
          <div className="flex items-center gap-3">
            <p className="hidden md:flex">Show entries</p>
            <Select
              className="w-20"
              defaultSelectedKeys={["20"]}
              labelPlacement="outside"
              aria-label="Set rows per page"
              onChange={(e) => setRowsPerPage(Number(e.target.value))}>
              {["20", "50"].map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </Select>
            <Button
              onClick={() => setShowFilters((prev) => !prev)}
              aria-label="Filters">
              <SlidersHorizontal size={18} />
              Filters
            </Button>
          </div>
        </div>
        <div className={`${showFilters ? "f-col gap-2" : "hidden"}`}>
          <Separator />
          <div className="flex items-center gap-3">
            <Select
              className="w-52"
              placeholder="Filter by sector"
              labelPlacement="outside"
              aria-label="Select sector"
              onChange={(e) => setSector(e.target.value)}>
              {sectors.map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </Select>
            <Select
              className="w-52"
              placeholder="Filter by exchange"
              labelPlacement="outside"
              aria-label="Select exchange"
              onChange={(e) => setExchange(e.target.value)}>
              {exchanges.map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </Select>
          </div>
          <Separator />
        </div>
      </div>
    );
  }, [filterValue, onClear, showFilters]);

  const bottomContent = useMemo(() => {
    return (
      <Pagination
        className="mt-2 self-center"
        aria-label="Pagination"
        total={Math.ceil(filteredStocks.length / rowsPerPage)}
        page={page}
        onChange={setPage}
      />
    );
  }, [filteredStocks, page, rowsPerPage]);

  return (
    <div className="f-col gap-4 w-full">
      <Table
        aria-label="Assets Table"
        topContent={topContent}
        topContentPlacement="outside"
        bottomContent={bottomContent}
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}>
        <TableHeader>
          {COLUMNS.map((column) => (
            <TableColumn key={column} className="text-sm" allowsSorting={true}>
              {columnTranslation[column]}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody emptyContent={"No stocks found"}>
          {sortedItems.map((stock, i) => (
            <TableRow
              key={stock.symbol + i}
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
