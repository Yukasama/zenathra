"use client";

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
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
import Link from "next/link";

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
    <Popover placement="bottom">
      <PopoverTrigger>
        <Button
          isIconOnly
          size="sm"
          variant="flat"
          startContent={<Plus size={18} />}
          aria-label="Add stock to portfolio"
        />
      </PopoverTrigger>
      <PopoverContent>
        {isAuth && portfolios?.length ? (
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
        ) : isAuth && !portfolios?.length ? (
          <div className="f-col gap-1 items-center">
            Create a portfolio first
            <Button href="/portfolio" color="primary" as={Link}>
              Create Portfolio
            </Button>
          </div>
        ) : (
          <div className="f-col gap-1 items-center">
            Sign in to create portfolios
            <Button href="/sign-in" color="primary" as={Link}>
              Sign in
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
