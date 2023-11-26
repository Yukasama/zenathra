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
import { Stock } from "@prisma/client";

interface Props {
  stock: Pick<Stock, "id" | "symbol"> | undefined;
  isAuth: boolean;
  portfolios:
    | Pick<
        PortfolioWithStocks,
        "id" | "title" | "color" | "stocks" | "isPublic"
      >[]
    | undefined;
}

export default function StockPortfolioAddModal({
  stock,
  isAuth,
  portfolios,
}: Props) {
  const { loginToast } = useCustomToasts();

  const handleClick = () => {
    if (!isAuth) {
      return loginToast();
    }

    if (!portfolios || portfolios.length === 0) {
      return toast({ description: "You have to create a portfolio first." });
    }
  };

  return (
    <>
      {!isAuth ? (
        <Button
          isIconOnly
          size="sm"
          startContent={<Plus className="h-4" />}
          onClick={handleClick}
          aria-label="Add stock to portfolio"
        />
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              isIconOnly
              size="sm"
              startContent={<Plus className="h-4" />}
              aria-label="Add stock to portfolio"
            />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Toggle {stock?.symbol}</DialogTitle>
              <DialogDescription>
                Manage {stock?.symbol} stock in your portfolios
              </DialogDescription>
            </DialogHeader>
            <div className="f-col gap-2.5">
              {stock &&
                portfolios?.map((portfolio) => (
                  <StockPortfolioModifier
                    key={portfolio.id}
                    portfolio={portfolio}
                    stock={stock}
                  />
                ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
