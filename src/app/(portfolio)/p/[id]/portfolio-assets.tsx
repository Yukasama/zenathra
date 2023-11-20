"use client";

import { useState, useMemo, startTransition } from "react";
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
import { Search, Plus, MoreVertical } from "lucide-react";
import { Portfolio, Stock } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  SkeletonText,
  SkeletonButton,
  SkeletonList,
} from "@/components/ui/skeleton";
import { StockQuote } from "@/types/db";
import { trpc } from "@/app/_trpc/client";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface Props {
  stockQuotes: Pick<
    StockQuote,
    "id" | "symbol" | "companyName" | "sector" | "peRatioTTM"
  >[];
  portfolio: Pick<Portfolio, "id">;
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

  const rowsPerPage = 5;
  const columns = ["companyName", "peRatioTTM", "sector", "actions"];

  const { mutate: remove, isLoading } = trpc.portfolio.remove.useMutation({
    onError: () =>
      toast({
        title: "Oops! Something went wrong.",
        description: `Failed to remove position.`,
        variant: "destructive",
      }),
    onSuccess: () => {
      startTransition(() => router.refresh());
    },
  });

  const filteredStocks = useMemo(() => {
    return stockQuotes.filter((stock) =>
      stock.companyName.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [stockQuotes, filterValue]);

  const paginatedStocks = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredStocks.slice(start, end);
  }, [filteredStocks, page, rowsPerPage]);

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
              <DropdownTrigger>
                <Button size="sm" isIconOnly>
                  <MoreVertical size={18} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem>View</DropdownItem>
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
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Search size={18} aria-label="Search" />
          <Input
            type="text"
            placeholder="Search by company name..."
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}></Input>
        </div>
        <Button className="bg-primary">
          Add New <Plus size={18} />
        </Button>
      </div>

      <Table className="h-[320px] min-w-[700px]" aria-labelledby="Stocktable">
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column}>{columnTranslation[column]}</TableColumn>
          ))}
        </TableHeader>
        <TableBody isLoading={isLoading}>
          {paginatedStocks.map((stock) => (
            <TableRow key={stock.id}>
              {columns.map((column) => (
                <TableCell key={column}>{renderCell(stock, column)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination
        className="mt-4 self-center"
        total={Math.ceil(filteredStocks.length / rowsPerPage)}
        page={page}
        onChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
}
