"use client";

import { Plus } from "react-feather";
import toast from "react-hot-toast";
import { Portfolio, User } from "@/types/db";
import { Button, ModalForm } from "@/components/ui";
import { useState } from "react";
import { StockPortfolioAddModal } from "@/components";

interface Props {
  user: User | null;
  symbol: string;
  portfolios: Portfolio[] | null;
  className?: string;
}

export default function StockPortfolioAddButton({
  user,
  symbol,
  portfolios,
  className,
}: Props) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (!user) return toast.error("You have to be logged in.");
    if (!portfolios || portfolios.length === 0)
      return toast.error("You have to create a portfolio first.");

    setOpen(true);
  };

  return (
    <div className={className}>
      <Button icon={<Plus className="h-4" />} onClick={handleClick} />
      {portfolios && user && (
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
