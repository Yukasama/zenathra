"use client";

import { deletePortfolio } from "@/lib/portfolio-update";
import { Portfolio } from "@/types/db";
import { useRouter } from "next/navigation";
import { Trash } from "react-feather";
import { Button } from "@/components/ui";
import toast from "react-hot-toast";
import { useState } from "react";

type Props = {
  portfolio: Portfolio;
};

export default function PortfolioDeleteButton({ portfolio }: Props) {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);

    const loading = toast.loading(`Deleting Portfolio '${portfolio.title}'...`);
    try {
      await deletePortfolio(portfolio.id);
      toast.success(`Portfolio '${portfolio.title}' deleted.`, { id: loading });
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
