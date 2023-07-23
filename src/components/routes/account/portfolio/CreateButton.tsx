"use client";

import React, { useState } from "react";
import { Plus } from "react-feather";
import CreatePortfolio from "@/components/routes/account/portfolio/CreatePortfolio";
import { User } from "@/types/user";

export default function CreateButton() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="flex-box h-10 w-10 rounded-full bg-blue-500 hover:bg-blue-500/80">
        <Plus className="h-7 w-7 text-white" />
      </button>
      <div className={`${open ? "block" : "hidden"}`}></div>
      <div className={`${!open && "hidden"} modal hiding-wall`}>
        <CreatePortfolio setOpen={setOpen} />
      </div>
    </div>
  );
}
