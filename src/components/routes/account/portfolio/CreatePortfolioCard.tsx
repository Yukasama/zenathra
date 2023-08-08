"use client";

import React, { useState } from "react";
import { Plus } from "react-feather";
import CreatePortfolio from "@/components/routes/account/portfolio/CreatePortfolio";
import Modal from "@/components/ui/Modal";

export default function CreatePortfolioCard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="relative group f-box h-full min-h-[300px] gap-4 p-5 box hover:bg-gray-200 dark:hover:bg-moon-800 cursor-pointer">
        <div className="f-box h-10 w-10 rounded-full bg-blue-500 group-hover:bg-blue-500/80">
          <Plus className="h-7 w-7 text-white" />
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create your new Portfolio">
        <CreatePortfolio onClose={() => setIsOpen(false)} />
      </Modal>
    </>
  );
}
