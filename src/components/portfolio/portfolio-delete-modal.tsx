"use client";

import { Portfolio } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { CardDescription } from "../ui/card";
import { trpc } from "@/trpc/client";

type Props = {
  portfolio: Pick<Portfolio, "id" | "title">;
};

export default function PortfolioDeleteModal({ portfolio }: Props) {
  const [title, setTitle] = useState("");
  const router = useRouter();

  const { mutate: deletePortfolio, isLoading } =
    trpc.portfolio.delete.useMutation({
      onError: () => {
        toast.error(`Portfolio '${portfolio.title}' could not be deleted.`);
      },
      onSuccess: () => router.push("/portfolio"),
    });

  function onSubmit() {
    if (title !== "CONFIRM") {
      return toast.warning("Please enter 'CONFIRM' to complete the deletion.");
    }

    deletePortfolio(portfolio.id);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-red-500 text-white" aria-label="Delete portfolio">
          <Trash2 size={18} />
          Delete
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <p className="w-54 truncate">Delete Portfolio {portfolio.title}?</p>
          </DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>

        <div className="grid w-full items-center gap-1.5">
          <Input
            placeholder="CONFIRM"
            onChange={(e) => setTitle(e.target.value)}
          />
          <CardDescription>
            Enter &apos;CONFIRM&apos; to delete your portfolio.
          </CardDescription>
        </div>

        <Button
          className="bg-red-500 text-white"
          isLoading={isLoading}
          onClick={onSubmit}
          aria-label="Delete portfolio">
          {!isLoading && <Trash2 size={18} />}
          Delete Portfolio
        </Button>
      </DialogContent>
    </Dialog>
  );
}
