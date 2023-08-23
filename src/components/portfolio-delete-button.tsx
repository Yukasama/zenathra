"use client";

import { Portfolio } from "@/types/db";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
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

      const { data } = await axios.post("/api/portfolio/delete", payload);
      return data as string;
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
      color="red"
      loading={isLoading}
      label="Delete"
      onClick={() => deletePortfolio()}
      icon={<Trash className="h-4 w-4" />}
    />
  );
}
