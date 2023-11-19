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
  portfolio: Pick<Portfolio, "id" | "isPublic">;
}

export default function EditVisibility({ portfolio }: Props) {
  const router = useRouter();

  const { mutate: editVisible, isLoading } = trpc.portfolio.edit.useMutation({
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
          portfolio.isPublic ? "private" : "public"
        }.`,
      });
    },
  });

  return (
    <Select
      onValueChange={(e) =>
        editVisible({
          portfolioId: portfolio.id,
          isPublic: e === "Public" ? true : false,
        })
      }
      disabled={isLoading}
      value={portfolio.isPublic ? "Public" : "Private"}>
      <SelectTrigger>
        <SelectValue placeholder="Private">
          {portfolio.isPublic ? "Public" : "Private"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem
          className="cursor-pointer"
          value={portfolio.isPublic ? "Private" : "Public"}>
          {portfolio.isPublic ? "Private" : "Public"}
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
