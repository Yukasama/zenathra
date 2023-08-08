"use client";

import { Portfolio } from "@/types/portfolio";
import toast from "react-hot-toast";
import { Button } from "../buttons";
import { Plus, Trash2, X } from "react-feather";
import {
  addToPortfolio,
  removeFromPortfolio,
} from "@/lib/portfolio/managePortfolio";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  portfolios: Portfolio[];
  setOpen?: any;
  symbol: string;
  x?: boolean;
}

export default function AddModal({
  portfolios,
  setOpen,
  symbol,
  x = true,
}: Props) {
  const [loading, setLoading] = useState<string[]>([]);
  const router = useRouter();

  const handleClick = async (portfolioId: string, action: "add" | "remove") => {
    setLoading([...loading, portfolioId]);

    action === "add"
      ? await addToPortfolio(symbol, portfolioId)
          .then(() => toast.success("Added!"))
          .catch(() =>
            toast.error("Something went wrong. Please try again later.")
          )
      : await removeFromPortfolio(symbol, portfolioId)
          .then(() => toast.success("Removed!"))
          .catch(() =>
            toast.error("Something went wrong. Please try again later.")
          );

    router.refresh();
    setLoading(loading.filter((id) => id !== portfolioId));
  };

  useEffect(() => {
    if (x) {
      document.addEventListener("click", handleHide);
      return () => {
        document.removeEventListener("click", handleHide);
      };
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

  return (
    <div className="input-window hiding-wall relative mb-20 f-col w-[400px] gap-4 rounded-lg bg-moon-200 p-5">
      <div>
        <p className="mb-2 text-lg font-light">Add {symbol} to Portfolios</p>
        {portfolios.map((portfolio) => (
          <div
            className="flex cursor-pointer items-center justify-between gap-2 rounded-md p-2.5 px-4 hover:bg-moon-100"
            key={portfolio.id}>
            <div>
              <p className="w-[250px] truncate font-semibold">
                {portfolio.title}
              </p>
              <p className="text-[12px] text-gray-500">
                {portfolio.public ? "Public" : "Private"}
              </p>
            </div>
            {portfolio.symbols.includes(symbol) ? (
              <Button
                icon={<Trash2 className="h-4" />}
                onClick={() => handleClick(portfolio.id, "remove")}
                color="red"
                loading={loading.includes(portfolio.id)}
              />
            ) : (
              <Button
                icon={<Plus className="h-4" />}
                onClick={() => handleClick(portfolio.id, "add")}
                color="green"
                loading={loading.includes(portfolio.id)}
              />
            )}
          </div>
        ))}
      </div>
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
