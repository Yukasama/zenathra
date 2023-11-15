"use client";

import { Portfolio } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import { startTransition, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
    if (title !== "CONFIRM")
      return toast({
        title: "Oops! Something went wrong.",
        description: "Please enter the correct title.",
        variant: "destructive",
      });

    deletePortfolio(portfolio.id);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-red-500 rounded-md">
          <Trash2 className="h-4 w-4" />
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
          <Input
            placeholder="CONFIRM"
            onChange={(e) => setTitle(e.target.value)}
          />
          <CardDescription>
            Enter &apos;CONFIRM&apos; to delete your portfolio.
          </CardDescription>
        </div>
        <DialogFooter>
          <Button
            className="bg-red-500 rounded-md"
            isLoading={isLoading}
            onClick={onSubmit}>
            <Trash2 className="h-4 w-4" />
            Delete Portfolio
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
