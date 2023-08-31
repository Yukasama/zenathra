"use client";

import { useState } from "react";
import PortfolioCreateModal from "./portfolio-create-modal";
import ModalForm from "./ui/modal-form";
import { Plus } from "lucide-react";
import { Card } from "./ui/card";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

export default function PortfolioCreateCard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Card
        onClick={() => setIsOpen(true)}
        className="f-box min-h-[300px] cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900">
        <div className={cn(buttonVariants({size: "sm"}), "bg-primary")}>
          <Plus />
        </div>
      </Card>
      <ModalForm
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create your new Portfolio">
        <PortfolioCreateModal onClose={() => setIsOpen(false)} />
      </ModalForm>
    </>
  );
}
