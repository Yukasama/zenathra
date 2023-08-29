"use client";

import { useState } from "react";
import PortfolioAddModal from "./portfolio-add-modal";
import ModalForm from "./ui/modal-form";
import { Plus } from "lucide-react";
import { Portfolio } from "@prisma/client";

interface Props {
  portfolio: Portfolio;
  stockIds: string[];
}

export default function PortfolioAddButton({ portfolio, stockIds }: Props) {
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
          stockIds={stockIds}
          onClose={() => setOpen(false)}
        />
      </ModalForm>
    </div>
  );
}
