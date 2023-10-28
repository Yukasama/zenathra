"use client";

import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { Button } from "../ui/button";
import { Plus, Trash2 } from "lucide-react";
import { PortfolioWithStocks } from "@/types/db";
import { Card } from "../ui/card";
import { trpc } from "@/app/_trpc/client";
import PortfolioImage from "../portfolio/portfolio-image";

interface Props {
  portfolio: Pick<
    PortfolioWithStocks,
    "id" | "title" | "color" | "public" | "stocks"
  >;
  symbolId: string;
}

export default function StockPortfolioModifier({ portfolio, symbolId }: Props) {
  const router = useRouter();

  const { mutate: addToPortfolio, isLoading: isAddLoading } =
    trpc.portfolio.add.useMutation({
      onError: () =>
        toast({
          title: "Oops! Something went wrong.",
          description: `Failed to add to portfolio.`,
          variant: "destructive",
        }),
      onSuccess: () => {
        startTransition(() => router.refresh());

        toast({ description: `Added to portfolio.` });
      },
    });

  const { mutate: removeFromPortfolio, isLoading: isRemoveLoading } =
    trpc.portfolio.remove.useMutation({
      onError: () =>
        toast({
          title: "Oops! Something went wrong.",
          description: `Failed to remove from portfolio.`,
          variant: "destructive",
        }),
      onSuccess: () => {
        startTransition(() => router.refresh());

        toast({ description: `Removed from portfolio.` });
      },
    });

  return (
    <Card className="relative p-2 px-3">
      <div className="flex items-center gap-3">
        <PortfolioImage portfolio={portfolio} />
        <div>
          <p className="w-[220px] truncate font-semibold">{portfolio.title}</p>
          <p className="text-zinc-400 text-[13px]">
            {portfolio.public ? "Public" : "Private"}
          </p>
        </div>
      </div>

      {portfolio.stocks.includes(symbolId) ? (
        <Button
          onClick={() =>
            removeFromPortfolio({
              portfolioId: portfolio.id,
              stockIds: [symbolId],
            })
          }
          variant="destructive"
          isLoading={isRemoveLoading}
          className={`w-full h-full absolute top-0 left-0 ${
            !isRemoveLoading ? "opacity-0" : "opacity-50"
          } hover:opacity-50`}>
          <Trash2 className="h-5" color="white" />
        </Button>
      ) : (
        <Button
          onClick={() =>
            addToPortfolio({
              portfolioId: portfolio.id,
              stockIds: [symbolId],
            })
          }
          variant="success"
          isLoading={isAddLoading}
          className={`w-full h-full absolute top-0 left-0 ${
            !isAddLoading ? "opacity-0" : "opacity-20 dark:opacity-30"
          } opacity-20 dark:opacity-30`}>
          <Plus className="h-6" color="white" />
        </Button>
      )}
    </Card>
  );
}
