"use client";

import { createPortfolio } from "@/lib/portfolio/managePortfolio";
import { useRouter } from "next/navigation";
import { Plus, X } from "react-feather";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { Input, Checkbox } from "@/components/ui/inputs";
import { Button } from "@/components/ui/buttons";

interface Props {
  numberOfPortfolios?: number;
  setOpen?: any;
  x?: boolean;
}

export default function CreatePortfolio({
  numberOfPortfolios = 0,
  setOpen,
  x = true,
}: Props) {
  const [title, setTitle] = useState("");
  const [publicPortfolio, setPublicPortfolio] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (x) {
      document.addEventListener("click", handleHide);
      return () => document.removeEventListener("click", handleHide);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleHide(e: any) {
    if (
      x &&
      e.target.closest(".hiding-wall") &&
      !e.target.closest(".input-window")
    )
      setOpen(false);
  }

  const handleClick = async () => {
    setTitle("");

    if (title.length < 1) return toast.error("Please choose a longer title.");
    if (title.length > 30) return toast.error("Please choose a shorter title.");
    if (numberOfPortfolios >= 3)
      return toast.error("Maximum number of portfolios reached.");

    const loading = toast.loading(`Creating Portfolio '${title}'...`);
    await createPortfolio(title, publicPortfolio)
      .then(() => {
        toast.success(`Portfolio '${title}' created`, { id: loading });
      })
      .catch(() => {
        toast.error("Error creating Portfolio", { id: loading });
      });

    x && setOpen(false);
    router.refresh();
  };

  return (
    <div className="input-window relative mb-20 f-col w-[400px] gap-4 rounded-lg bg-moon-200 p-5">
      <h2 className="text-lg font-medium">Create a Portfolio</h2>
      <Input
        id="createPortfolio"
        type="text"
        label="Portfolio Title"
        onChange={setTitle}
        focus
      />
      <Checkbox className="ml-1" label="Public" onChange={setPublicPortfolio} />
      <Button
        label="Create Portfolio"
        icon={<Plus className="h-[16px] w-[16px]" />}
        onClick={handleClick}
        color="green"
      />
      {x && (
        <button
          onClick={() => setOpen(false)}
          className="absolute right-3 top-3">
          <X />
        </button>
      )}
    </div>
  );
}
