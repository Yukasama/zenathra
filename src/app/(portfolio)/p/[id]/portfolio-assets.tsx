"use client";

import { useState, useMemo } from "react";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Pagination,
  Spinner,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { Search, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  SkeletonText,
  SkeletonButton,
  SkeletonList,
} from "@/components/ui/skeleton";
import { StockQuote } from "@/types/stock";
import { trpc } from "@/trpc/client";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import PortfolioAddModal from "@/components/portfolio/portfolio-add-modal";
import { PortfolioWithStocks } from "@/types/db";
import StockImage from "@/components/stock/stock-image";

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
  >[];
  portfolio: Pick<PortfolioWithStocks, "id" | "title" | "stocks">;
}

export function PortfolioAssetsLoading() {
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
  symbol: "Symbol",
  price: "Price (24h)",
  sector: "Sector",
  actions: "Actions",
};

export default function PortfolioAssets({ stockQuotes, portfolio }: Props) {
  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(1);
  const router = useRouter();

  const ROWS_PER_PAGE = 5;
  const COLUMNS = ["symbol", "price", "sector", "actions"];

  const { mutate: remove, isLoading } = trpc.portfolio.remove.useMutation({
    onError: () => {
      toast({
        title: "Oops! Something went wrong.",
        description: `Failed to remove position.`,
      });
    },
    onSuccess: () => router.refresh(),
  });

  // Filtering and sorting stocks
  const filteredStocks = useMemo(() => {
    return stockQuotes
      .filter((stock) =>
        stock.companyName.toLowerCase().includes(filterValue.toLowerCase())
      )
      .sort((a, b) => a.companyName.localeCompare(b.companyName));
  }, [stockQuotes, filterValue]);

  // Slicing stocks for pagination
  const paginatedStocks = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    const end = start + ROWS_PER_PAGE;
    return filteredStocks.slice(start, end);
  }, [filteredStocks, page, ROWS_PER_PAGE]);

  // Single cell for assets table
  const renderCell = (stock: StockQuote, columnKey: string) => {
    switch (columnKey) {
      case "symbol":
        return (
          <div className="flex items-center gap-3">
            <StockImage src={stock.image} px={35} />
            <div>
              <p>{stock.symbol}</p>
              <p className="text-[13px] text-zinc-500 max-w-[150px] truncate">
                {stock.companyName}
              </p>
            </div>
          </div>
        );
      case "price":
        return (
          <div>
            <p>{stock.price?.toFixed(2)}</p>
            {stock.changesPercentage > 0 ? (
              <span className="text-green-500 dark:text-green-400 text-[13px]">
                {" "}
                +{stock.changesPercentage?.toFixed(2)}%
              </span>
            ) : (
              <span className="text-red-500 dark:text-red-400 text-[13px]">
                {" "}
                {stock.changesPercentage?.toFixed(2)}%
              </span>
            )}
          </div>
        );
      case "sector":
        return (
          <Chip color="primary" size="sm" variant="dot">
            {stock[columnKey]}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger disabled={isLoading}>
                <Button
                  size="sm"
                  isLoading={isLoading}
                  isIconOnly
                  variant="flat"
                  aria-label="Actions">
                  {!isLoading && <MoreVertical size={18} />}
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  aria-label="View stock"
                  onClick={() => router.push(`/stocks/${stock.symbol}`)}>
                  View
                </DropdownItem>
                <DropdownItem aria-label="Edit position">Edit</DropdownItem>
                <DropdownItem
                  aria-label="Remove stock"
                  color="danger"
                  onClick={() =>
                    remove({
                      portfolioId: portfolio.id,
                      stockIds: [stock.id],
                    })
                  }>
                  {isLoading && <Spinner size="sm" />}
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="f-col w-full max-w-[800px]">
      {/* Operations Bar */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Search size={18} aria-label="Search" />
          <Input
            type="text"
            placeholder="Search by company name..."
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}></Input>
        </div>
        <PortfolioAddModal portfolio={portfolio} />
      </div>

      {/* Assets Table */}
      <Table aria-label="Assets Table">
        <TableHeader>
          {COLUMNS.map((column) => (
            <TableColumn key={column}>{columnTranslation[column]}</TableColumn>
          ))}
        </TableHeader>
        <TableBody isLoading={isLoading}>
          {paginatedStocks.map((stock) => (
            <TableRow key={stock.id}>
              {COLUMNS.map((column) => (
                <TableCell key={column}>{renderCell(stock, column)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Control for Table */}
      <Pagination
        className="mt-2 self-center"
        total={Math.ceil(filteredStocks.length / ROWS_PER_PAGE)}
        page={page}
        onChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
}
