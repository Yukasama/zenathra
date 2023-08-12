"use client";

import { Plus } from "react-feather";
import toast from "react-hot-toast";
import { User } from "@/types/user";
import { Portfolio } from "@/types/portfolio";
import Button from "@/components/ui/buttons/Button";
import { useState } from "react";
import AddModal from "../portfolios/AddModal";
import Modal from "../Modal";

interface Props {
  user: User | null;
  symbol: string;
  portfolios: Portfolio[] | null;
  className?: string;
}

export default function Like({ user, symbol, portfolios, className }: Props) {
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
        <Modal
          title={`Add '${symbol}' to portfolios`}
          isOpen={open}
          onClose={() => setOpen(false)}>
          <AddModal
            portfolios={portfolios}
            setOpen={() => setOpen(false)}
            symbol={symbol}
          />
        </Modal>
      )}
    </div>
  );
}
