"use client";

import { Plus } from "react-feather";
import toast from "react-hot-toast";
import { User } from "@/types/user";
import { Portfolio } from "@/types/portfolio";
import Button from "@/components/ui/buttons/Button";
import { useState } from "react";
import AddModal from "../portfolios/AddModal";

interface Props {
  user: User | null;
  symbol: string;
  portfolios: Portfolio[] | null;
}

export default function Like({ user, symbol, portfolios }: Props) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (!user) return toast.error("You have to be logged in.");
    if (!portfolios || portfolios.length === 0)
      return toast.error("You have to create a portfolio first.");

    setOpen(true);
  };

  return (
    <div>
      <Button icon={<Plus className="h-4" />} onClick={handleClick} />
      {portfolios && user && (
        <div className={`${open ? "block" : "hidden"} modal`}>
          <AddModal portfolios={portfolios} setOpen={setOpen} symbol={symbol} />
        </div>
      )}
    </div>
  );
}
