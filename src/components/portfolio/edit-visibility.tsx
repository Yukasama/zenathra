"use client";

import { Portfolio } from "@prisma/client";
import { trpc } from "@/app/_trpc/client";
import { toast } from "@/hooks/use-toast";
import { startTransition } from "react";
import { useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Props {
  portfolio: Pick<Portfolio, "id" | "public">;
}

export default function EditVisibility({ portfolio }: Props) {
  const router = useRouter();

  const { mutate: editVisibility, isLoading } = trpc.portfolio.edit.useMutation(
    {
      onError: () =>
        toast({
          title: "Oops! Something went wrong.",
          description: `Failed to change portfolio visibility.`,
          variant: "destructive",
        }),
      onSuccess: () => {
        startTransition(() => router.refresh());

        toast({
          description: `Visibility successfully changed to ${
            portfolio.public ? "private" : "public"
          }.`,
        });
      },
    }
  );

  return (
    <Select
      onValueChange={(e) =>
        editVisibility({
          portfolioId: portfolio.id,
          publicPortfolio: e === "Public" ? true : false,
        })
      }
      disabled={isLoading}
      value={portfolio.public ? "Public" : "Private"}>
      <SelectTrigger>
        <SelectValue placeholder="Private">
          {portfolio.public ? "Public" : "Private"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem
          className="cursor-pointer"
          value={portfolio.public ? "Private" : "Public"}>
          {portfolio.public ? "Private" : "Public"}
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
