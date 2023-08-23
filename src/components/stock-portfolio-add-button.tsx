"use client";

import toast from "react-hot-toast";
import { Portfolio, User } from "@/types/db";
import { Button, ModalForm } from "@/components/ui";
import { useState } from "react";
import { StockPortfolioAddModal } from "@/components";
import { Session } from "next-auth";
import { Plus } from "lucide-react";

interface Props {
  session: Session | null;
  symbol: string;
  portfolios: Portfolio[] | null;
  className?: string;
}

export default function StockPortfolioAddButton({
  session,
  symbol,
  portfolios,
  className,
}: Props) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (!session) return toast.error("You have to be logged in.");
    if (!portfolios || portfolios.length === 0)
      return toast.error("You have to create a portfolio first.");

    setOpen(true);
  };

  return (
    <div className={className}>
      <Button icon={<Plus className="h-4" />} onClick={handleClick} />
      {portfolios && session?.user && (
        <ModalForm
          title={`Add '${symbol}' to portfolios`}
          isOpen={open}
          onClose={() => setOpen(false)}>
          <StockPortfolioAddModal
            portfolios={portfolios}
            setOpen={() => setOpen(false)}
            symbol={symbol}
          />
        </ModalForm>
      )}
    </div>
  );
}
