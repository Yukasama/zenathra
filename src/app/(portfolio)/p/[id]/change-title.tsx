"use client";

import { Input } from "@/components/ui/input";
import { Portfolio } from "@prisma/client";
import { Pencil } from "lucide-react";
import { useState } from "react";

interface Props {
  portfolio: Pick<Portfolio, "title">;
}

export default function ChangeTitle({ portfolio }: Props) {
  const [title, setTitle] = useState(portfolio.title);
  const [disabled, setDisabled] = useState(true);

  return (
    <div className="flex">
      <Input
        className="border-none h-7"
        value={title}
        disabled={disabled}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div
        onClick={() => setDisabled(false)}
        className="f-box cursor-pointer hover:bg-zinc-600 ">
        <Pencil className="h-4 w-4" />
      </div>
    </div>
  );
}
