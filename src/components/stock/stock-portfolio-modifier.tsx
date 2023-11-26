"use client";

import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import { Plus, Trash2 } from "lucide-react";
import { PortfolioWithStocks } from "@/types/db";
import { Card } from "../ui/card";
import { trpc } from "@/trpc/client";
import PortfolioImage from "../portfolio/portfolio-image";
import { Stock } from "@prisma/client";

interface Props {
  portfolio: Pick<
    PortfolioWithStocks,
    "id" | "title" | "color" | "isPublic" | "stocks"
  >;
  stock: Pick<Stock, "id">;
}

export default function StockPortfolioModifier({ portfolio, stock }: Props) {
  const router = useRouter();

  const { mutate: addToPortfolio, isLoading: isAddLoading } =
    trpc.portfolio.add.useMutation({
      onError: () =>
        toast({
          title: "Oops! Something went wrong.",
          description: `Failed to add to portfolio.`,
          variant: "destructive",
        }),
      onSuccess: () => router.refresh(),
    });

  const { mutate: removeFromPortfolio, isLoading: isRemoveLoading } =
    trpc.portfolio.remove.useMutation({
      onError: () =>
        toast({
          title: "Oops! Something went wrong.",
          description: `Failed to remove from portfolio.`,
          variant: "destructive",
        }),
      onSuccess: () => router.refresh(),
    });

  return (
    <Card className="relative p-2 px-3">
      <div className="flex items-center gap-3">
        <PortfolioImage portfolio={portfolio} />
        <div>
          <p className="w-[220px] truncate font-semibold">{portfolio.title}</p>
          <p className="text-zinc-400 text-[13px]">
            {portfolio.isPublic ? "Public" : "Private"}
          </p>
        </div>
      </div>

      {portfolio.stocks.map((s) => s.stockId).includes(stock.id) ? (
        <Button
          onClick={() =>
            removeFromPortfolio({
              portfolioId: portfolio.id,
              stockIds: [stock.id],
            })
          }
          isLoading={isRemoveLoading}
          disabled={isRemoveLoading}
          aria-label="Remove from portfolio"
          className={`w-full h-full absolute bg-red-500 top-0 left-0 ${
            !isRemoveLoading ? "opacity-0" : "opacity-30"
          } hover:opacity-30`}>
          {!isRemoveLoading && <Trash2 size={20} color="white" />}
        </Button>
      ) : (
        <Button
          onClick={() =>
            addToPortfolio({
              portfolioId: portfolio.id,
              stockIds: [stock.id],
            })
          }
          color="success"
          isLoading={isAddLoading}
          disabled={isAddLoading}
          aria-label="Add to portfolio"
          className={`w-full h-full absolute top-0 left-0 ${
            !isAddLoading ? "opacity-0" : "opacity-20 dark:opacity-30"
          } opacity-20 dark:opacity-30`}>
          {!isAddLoading && <Plus color="white" />}
        </Button>
      )}
    </Card>
  );
}
