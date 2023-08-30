"use client";

import { Portfolio } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { startTransition } from "react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { DeletePortfolioProps } from "@/lib/validators/portfolio";
import { Trash } from "lucide-react";

type Props = {
  portfolio: Pick<Portfolio, "id" | "title">;
};

export default function PortfolioDeleteButton({ portfolio }: Props) {
  const router = useRouter();

  const { mutate: deletePortfolio, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: DeletePortfolioProps = {
        portfolioId: portfolio.id,
      };

      await axios.post("/api/portfolio/delete", payload);
    },
    onError: () => {
      toast({
        title: "Oops! Something went wrong.",
        description: `Portfolio '${portfolio.title}' could not be deleted.`,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      toast({
        title: "Portfolio Deleted.",
        description: `Portfolio '${portfolio.title}' won't longer show up in your portfolios.`,
      });
    },
  });

  return (
    <Button
      isLoading={isLoading}
      variant="destructive"
      onClick={() => deletePortfolio()}>
      <Trash className="h-4 w-4" />
      Delete
    </Button>
  );
}
