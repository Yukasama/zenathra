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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

type Props = {
  portfolio: Pick<Portfolio, "id" | "title">;
};

export default function PortfolioDeleteModal({ portfolio }: Props) {
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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash className="h-4 w-4" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Portfolio?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input id="name" value="Pedro Duarte" className="col-span-3" />
        </div>
        <DialogFooter>
          <Button
            type="submit"
            variant="destructive"
            isLoading={isLoading}
            onClick={() => deletePortfolio()}>
            Delete Portfolio
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
