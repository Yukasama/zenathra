"use client";

import React, { useState, useMemo } from "react";
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
import type { Stock } from "@prisma/client";
import { Input } from "@/components/ui/input";

interface Props {
  stocks: Pick<Stock, "id" | "companyName" | "sector" | "peRatioTTM">[];
}

const columnTranslation: any = {
  companyName: "Name",
  peRatioTTM: "P/E Ratio",
  sector: "Sector",
  actions: "Actions",
};

export default function NewAssets({ stocks }: Props) {
  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const columns = ["companyName", "peRatioTTM", "sector", "actions"];

  const filteredStocks = useMemo(() => {
    return stocks.filter((stock) =>
      stock.companyName.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [stocks, filterValue]);

  const paginatedStocks = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredStocks.slice(start, end);
  }, [filteredStocks, page, rowsPerPage]);

  const renderCell = (
    stock: Pick<Stock, "id" | "companyName" | "sector" | "peRatioTTM">,
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
                <DropdownItem>Delete</DropdownItem>
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
          <Search size={18} />
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

      <Table className="h-[320px] min-w-[700px]">
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column}>{columnTranslation[column]}</TableColumn>
          ))}
        </TableHeader>
        <TableBody>
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
