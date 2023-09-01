"use client";

import { Button } from "./ui/button";
import { useState } from "react";
import type { Session } from "next-auth";
import { Plus } from "lucide-react";
import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { toast } from "@/hooks/use-toast";
import { PortfolioWithStocks } from "@/types/db";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import StockPortfolioModifier from "./stock-portfolio-modifier";

interface Props {
  session: Session | null;
  symbolId: string;
  symbol: string;
  portfolios: PortfolioWithStocks[] | null;
  className?: string;
}

export default function StockPortfolioAddButton({
  session,
  symbolId,
  symbol,
  portfolios,
  className,
}: Props) {
  const { loginToast } = useCustomToasts();

  const handleClick = () => {
    if (!session) return loginToast();
    if (!portfolios || portfolios.length === 0)
      return toast({ description: "You have to create a portfolio first." });
  };

  return (
    <>
      {!session?.user ? (
        <Button variant="subtle" size="xs" onClick={handleClick}>
          <Plus className="h-4" />
        </Button>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="subtle" size="xs">
              <Plus className="h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Toggle {symbol}</DialogTitle>
              <DialogDescription>
                Manage {symbol} stock in your portfolios
              </DialogDescription>
            </DialogHeader>
            <div className="f-col gap-2.5">
              {portfolios?.map((portfolio) => (
                <StockPortfolioModifier
                  key={portfolio.id}
                  portfolio={portfolio}
                  symbolId={symbolId}
                />
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
