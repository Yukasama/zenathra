"use client";

import { useState } from "react";
import { PortfolioAddModal } from "@/components";
import { Portfolio } from "@/types/db";
import { ModalForm } from "@/components/ui";
import { Plus } from "lucide-react";

interface Props {
  portfolio: Portfolio;
}

export default function PortfolioAddButton({ portfolio }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="f-box h-10 w-10 rounded-full bg-blue-500 hover:bg-blue-500/80">
        <Plus className="h-7 w-7 text-white" />
      </button>
      <ModalForm
        isOpen={open}
        title="Add Stocks to your portfolio"
        onClose={() => setOpen(false)}>
        <PortfolioAddModal
          portfolio={portfolio}
          onClose={() => setOpen(false)}
        />
      </ModalForm>
    </div>
  );
}
