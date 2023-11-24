"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";
import { Pagination } from "@nextui-org/pagination";
import { Chip } from "@nextui-org/chip";
import { Search, MoreVertical } from "lucide-react";
import { Stock } from "@prisma/client";
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
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  stockQuotes: Pick<
    StockQuote,
    "id" | "symbol" | "companyName" | "sector" | "peRatioTTM"
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
  companyName: "Name",
  peRatioTTM: "P/E Ratio",
  sector: "Sector",
  actions: "Actions",
};

export default function PortfolioAssets({ stockQuotes, portfolio }: Props) {
  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(1);
  const router = useRouter();

  const ROWS_PER_PAGE = 5;
  const COLUMNS = ["companyName", "peRatioTTM", "sector", "actions"];

  const queryClient = useQueryClient();
  const { mutate: remove, isLoading } = trpc.portfolio.remove.useMutation({
    onError: () => {
      toast({
        title: "Oops! Something went wrong.",
        description: `Failed to remove position.`,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["portfolio.remove"]);
      router.refresh();
    },
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
  const renderCell = (
    stock: Pick<
      Stock,
      "id" | "symbol" | "companyName" | "sector" | "peRatioTTM"
    >,
    columnKey: string
  ) => {
    switch (columnKey) {
      case "companyName":
        return <p>{stock.companyName}</p>;
      case "peRatioTTM":
        return <p>{stock.peRatioTTM?.toFixed(2)}</p>;
      case "sector":
        return (
          <Chip color="primary" size="sm" variant="flat">
            <p className="text-white">{stock[columnKey]}</p>
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger disabled={isLoading}>
                <Button size="sm" isIconOnly>
                  <MoreVertical size={18} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  onClick={() => router.push(`/stocks/${stock.symbol}`)}>
                  View
                </DropdownItem>
                <DropdownItem>Edit</DropdownItem>
                <DropdownItem
                  color="danger"
                  onClick={() =>
                    remove({
                      portfolioId: portfolio.id,
                      stockIds: [stock.id],
                    })
                  }>
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
    <div className="f-col">
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
      <Table className="min-w-[700px]" aria-labelledby="Assets Table">
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
        className="mt-4 self-center"
        total={Math.ceil(filteredStocks.length / ROWS_PER_PAGE)}
        page={page}
        onChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
}
