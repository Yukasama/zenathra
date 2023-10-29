"use client";

import { Button } from "@nextui-org/button";
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

interface Props {
  isAuthenticated: boolean;
  symbolId: string;
  symbol: string;
  portfolios:
    | Pick<
        PortfolioWithStocks,
        "id" | "title" | "color" | "stocks" | "public"
      >[]
    | undefined;
}

export default function StockPortfolioAddModal({
  isAuthenticated,
  symbolId,
  symbol,
  portfolios,
}: Props) {
  const { loginToast } = useCustomToasts();

  const handleClick = () => {
    if (!isAuthenticated) return loginToast();
    if (!portfolios || portfolios.length === 0)
      return toast({ description: "You have to create a portfolio first." });
  };

  return (
    <>
      {!isAuthenticated ? (
        <Button
          isIconOnly
          size="sm"
          className="gradient rounded-md"
          startContent={<Plus className="h-4" />}
          onClick={handleClick}
        />
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              isIconOnly
              size="sm"
              className="gradient rounded-md"
              startContent={<Plus className="h-4" />}></Button>
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
