"use client";

import { Portfolio, Stock } from "@prisma/client";
import { Card } from "../ui/card";
import { toast } from "@/hooks/use-toast";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { Minus } from "lucide-react";
import { StockImage } from "../stock/stock-image";
import { Button } from "../ui/button";

interface Props {
  stock: Stock;
  portfolio: Pick<Portfolio, "id">;
}

export default function PortfolioPosition({ stock, portfolio }: Props) {
  const router = useRouter();

  const { mutate: remove, isLoading } = trpc.portfolio.remove.useMutation({
    onError: () =>
      toast({
        title: "Oops! Something went wrong.",
        description: `Failed to remove position.`,
        variant: "destructive",
      }),
    onSuccess: () => {
      startTransition(() => router.refresh());

      toast({ description: `Position successfully removed.` });
    },
  });

  return (
    <Card className="h-14 flex items-center justify-between px-5">
      <div className="flex items-center gap-1.5">
        <StockImage px={30} src={stock.image} />
        <div>
          <h3 className="text-sm font-medium">{stock.symbol}</h3>
          <p className="text-slate-400 text-sm">{stock.companyName}</p>
        </div>
      </div>

      <Button
        className="w-6 h-6 rounded-full" size="xs" variant="destructive"
        isLoading={isLoading}
        onClick={() =>
          remove({
            portfolioId: portfolio.id,
            stockIds: stock.id,
          })
        }>
        <Minus className="h-4 w-4" />
      </Button>
    </Card>
  );
}
