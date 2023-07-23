"use client";

import { deletePortfolio } from "@/lib/portfolio/managePortfolio";
import { Portfolio } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Trash } from "react-feather";
import { Button } from "@/components/ui/buttons";
import toast from "react-hot-toast";
import { useState } from "react";

type Props = {
  portfolio: Portfolio;
};

export default function DeleteButton({ portfolio }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const loading = toast.loading(`Deleting Portfolio '${portfolio.title}'...`);

    try {
      await deletePortfolio(portfolio.id);
      toast.success(`Portfolio '${portfolio.title}' Deleted`, { id: loading });
    } catch {
      toast.error("Failed to delete portfolio", { id: loading });
    }

    setLoading(false);
    router.refresh();
  };

  return (
    <Button
      color="red"
      loading={loading}
      label="Delete"
      onClick={handleDelete}
      icon={<Trash className="h-4 w-4" />}
    />
  );
}
