"use client";

import React, { useState } from "react";
import { Plus } from "react-feather";
import AddToPortfolio from "@/components/routes/account/portfolio/AddToPortfolio";
import { Portfolio } from "@prisma/client";

interface Props {
  portfolio: Portfolio;
}

export default function AddButton({ portfolio }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="flex-box h-10 w-10 rounded-full bg-blue-500 hover:bg-blue-500/80">
        <Plus className="h-7 w-7 text-white" />
      </button>
      <div className={`${!open && "hidden"} modal`}>
        <AddToPortfolio portfolio={portfolio} setOpen={setOpen} />
      </div>
    </div>
  );
}
