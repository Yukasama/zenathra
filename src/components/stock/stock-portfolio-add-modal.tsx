"use client";

import { Button } from "../ui/button";
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
} from "../ui/dialog";
import StockPortfolioModifier from "./stock-portfolio-modifier";
import type { KindeUser } from "@kinde-oss/kinde-auth-nextjs/server";

interface Props {
  user: KindeUser | null;
  symbolId: string;
  symbol: string;
  portfolios: PortfolioWithStocks[] | undefined;
}

export default function StockPortfolioAddModal({
  user,
  symbolId,
  symbol,
  portfolios,
}: Props) {
  const { loginToast } = useCustomToasts();

  const handleClick = () => {
    if (!user) return loginToast();
    if (!portfolios || portfolios.length === 0)
      return toast({ description: "You have to create a portfolio first." });
  };

  return (
    <>
      {!user ? (
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
          <DialogContent className="rounded-md max-w-[375px]">
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
