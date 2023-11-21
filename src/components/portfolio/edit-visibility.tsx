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
  const status = portfolio.isPublic ? "Public" : "Private";

  const { mutate: editVisible, isLoading } = trpc.portfolio.edit.useMutation({
    onError: () => {
      toast({
        title: "Oops! Something went wrong.",
        description: `Failed to change portfolio visibility.`,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => router.refresh());
    },
  });

  return (
    <Select
      onValueChange={(e) => {
        editVisible({
          portfolioId: portfolio.id,
          isPublic: e === "Public" ? true : false,
        });
      }}
      disabled={isLoading}
      value={status}>
      <SelectTrigger>
        <SelectValue placeholder="Private">{status}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem className="cursor-pointer" value={status}>
          {status}
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
