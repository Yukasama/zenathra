"use client";

import { useState } from "react";
import { PortfolioCreateModal } from "@/components";
import { ModalForm } from "@/components/ui";
import { Plus } from "lucide-react";

export default function PortfolioCreateCard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="relative group f-box h-full min-h-[300px] gap-4 p-5 box hover:bg-slate-200 dark:hover:bg-moon-800 cursor-pointer">
        <div className="f-box h-10 w-10 rounded-full bg-blue-500 group-hover:bg-blue-500/80">
          <Plus className="h-7 w-7 text-white" />
        </div>
      </div>
      <ModalForm
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create your new Portfolio">
        <PortfolioCreateModal onClose={() => setIsOpen(false)} />
      </ModalForm>
    </>
  );
}
