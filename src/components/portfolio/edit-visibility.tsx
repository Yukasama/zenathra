"use client";

import { Portfolio } from "@prisma/client";
import { trpc } from "@/trpc/client";
import { toast } from "@/hooks/use-toast";
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
  const optionalChange = !portfolio.isPublic ? "Public" : "Private";

  const { mutate: editVisible, isLoading } = trpc.portfolio.edit.useMutation({
    onError: () => {
      toast({
        title: "Oops! Something went wrong.",
        description: `Failed to change portfolio visibility.`,
        variant: "destructive",
      });
    },
    onSuccess: () => router.refresh(),
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
      <SelectTrigger className="w-28">
        <SelectValue>{status}</SelectValue>
      </SelectTrigger>

      <SelectContent>
        <SelectItem className="cursor-pointer" value={optionalChange}>
          {optionalChange}
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
