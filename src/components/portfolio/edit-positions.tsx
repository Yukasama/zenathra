"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { buttonVariants } from "../ui/button";
import { Portfolio, Stock } from "@prisma/client";
import PortfolioPosition from "./portfolio-position";

interface Props {
  stocks: Pick<Stock, "id" | "symbol" | "image" | "companyName">[];
  portfolio: Pick<Portfolio, "id">;
}

export default function EditPositions({ stocks, portfolio }: Props) {
  return (
    <Dialog>
      <DialogTrigger>
        <div className={buttonVariants({ variant: "subtle" })}>
          <Pencil className="h-4 w-4" />
          Edit
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[375px] rounded-md">
        <DialogHeader>
          <DialogTitle>Edit Portfolio Positions</DialogTitle>
          <DialogDescription>
            Edit the positions in your portfolio.
          </DialogDescription>
        </DialogHeader>
        {stocks.map((stock) => (
          <PortfolioPosition
            key={stock.id}
            stock={stock}
            portfolio={portfolio}
          />
        ))}
      </DialogContent>
    </Dialog>
  );
}
