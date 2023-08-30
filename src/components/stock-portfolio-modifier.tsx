"use client";

import { toast } from "@/hooks/use-toast";
import { ModifySymbolsPortfolioProps } from "@/lib/validators/portfolio";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { Button } from "./ui/button";
import { Plus, Trash2 } from "lucide-react";
import { PortfolioWithStocks } from "@/types/db";

interface Props {
  portfolio: PortfolioWithStocks;
  symbolId: string;
}

export default function StockPortfolioModifier({ portfolio, symbolId }: Props) {
  const router = useRouter();

  const { mutate: addToPortfolio, isLoading: isAddLoading } = useMutation({
    mutationFn: async () => {
      const payload: ModifySymbolsPortfolioProps = {
        portfolioId: portfolio.id,
        stockIds: symbolId,
      };
      await axios.post("/api/portfolio/add", payload);
    },
    onError: () => {
      toast({
        title: "Oops! Something went wrong.",
        description: `Failed to add to portfolio.`,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => router.refresh());

      toast({
        description: `Added to portfolio.`,
      });
    },
  });

  const { mutate: removeFromPortfolio, isLoading: isRemoveLoading } =
    useMutation({
      mutationFn: async () => {
        const payload: ModifySymbolsPortfolioProps = {
          portfolioId: portfolio.id,
          stockIds: symbolId,
        };
        await axios.post("/api/portfolio/remove", payload);
      },
      onError: () => {
        toast({
          title: "Oops! Something went wrong.",
          description: `Failed to remove from portfolio.`,
          variant: "destructive",
        });
      },
      onSuccess: () => {
        startTransition(() => router.refresh());

        toast({
          description: `Removed from portfolio.`,
        });
      },
    });

  return (
    <div className="relative p-4 px-5 box">
      <p className="w-[250px] truncate font-semibold">{portfolio.title}</p>
      <p className="text-slate-400 text-[13px]">
        {portfolio.public ? "Public" : "Private"}
      </p>
      {portfolio.stockIds.map((s) => s.stockId).includes(symbolId) ? (
        <Button
          onClick={() => removeFromPortfolio()}
          variant="destructive"
          isLoading={isRemoveLoading}
          className={`w-full h-full absolute top-0 left-0 ${
            !isRemoveLoading ? "opacity-0" : "opacity-50"
          } hover:opacity-50`}>
          <Trash2 className="h-5" color="white" />
        </Button>
      ) : (
        <Button
          onClick={() => addToPortfolio()}
          isLoading={isAddLoading}
          className={`w-full h-full absolute top-0 left-0 ${
            !isAddLoading ? "opacity-0" : "opacity-50"
          } hover:opacity-50`}>
          <Plus className="h-6" color="white" />
        </Button>
      )}
    </div>
  );
}
