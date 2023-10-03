"use client";

import { Portfolio } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { startTransition, useState } from "react";
import { toast } from "@/hooks/use-toast";
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
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { CardDescription } from "../ui/card";
import { trpc } from "@/app/_trpc/client";

type Props = {
  portfolio: Pick<Portfolio, "id" | "title">;
};

export default function PortfolioDeleteModal({ portfolio }: Props) {
  const [title, setTitle] = useState<string>();

  const router = useRouter();

  const { mutate: deletePortfolio, isLoading } =
    trpc.portfolio.delete.useMutation({
      onError: () =>
        toast({
          title: "Oops! Something went wrong.",
          description: `Portfolio '${portfolio.title}' could not be deleted.`,
          variant: "destructive",
        }),
      onSuccess: () => {
        startTransition(() => router.refresh());

        toast({
          title: "Portfolio Deleted.",
          description: `Portfolio '${portfolio.title}' won't longer show up in your portfolios.`,
        });
      },
    });

  function onSubmit() {
    if (title !== `Delete ${portfolio.title}`)
      return toast({
        title: "Oops! Something went wrong.",
        description: "Please enter the correct title.",
        variant: "destructive",
      });

    const payload = {
      portfolioId: portfolio.id,
    };

    deletePortfolio(payload);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash className="h-4 w-4" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[375px] rounded-md">
        <DialogHeader>
          <DialogTitle>
            <p className="w-54 truncate">Delete Portfolio {portfolio.title}?</p>
          </DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="name">Title</Label>
          <Input
            id="name"
            placeholder={`Delete ${portfolio.title}`}
            onChange={(e) => setTitle(e.target.value)}
          />
          <CardDescription>
            Enter the portfolio title to continue
          </CardDescription>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            variant="destructive"
            isLoading={isLoading}
            onClick={onSubmit}>
            Delete Portfolio
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
