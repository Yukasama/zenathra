"use client";

import { Portfolio } from "@/types/db";
import toast from "react-hot-toast";
import { Button } from "@/components/ui";
import { addToPortfolio, removeFromPortfolio } from "@/lib/portfolio-update";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  portfolios: Portfolio[];
  setOpen?: any;
  symbol: string;
}

export default function StockPortfolioAddModal({
  portfolios,
  setOpen,
  symbol,
}: Props) {
  const [loading, setLoading] = useState<string[]>([]);
  const router = useRouter();

  const handleClick = async (portfolioId: string, action: "add" | "remove") => {
    setLoading([...loading, portfolioId]);

    try {
      if (action === "add") await addToPortfolio(symbol, portfolioId);
      else await removeFromPortfolio(symbol, portfolioId);
    } catch {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading((loading) => loading.filter((id) => id !== portfolioId));
      router.refresh();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleHide);
    return () => {
      document.removeEventListener("click", handleHide);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleHide(e: any) {
    if (e.target.closest(".hiding-wall") && !e.target.closest(".input-window"))
      setOpen(false);
  }

  return (
    <div className="f-col gap-2.5">
      {portfolios.map((portfolio) => (
        <div key={portfolio.id} className="relative p-4 px-5 box">
          <p className="w-[250px] truncate font-semibold">{portfolio.title}</p>
          <p className="text-slate-400 text-[13px]">
            {portfolio.public ? "Public" : "Private"}
          </p>
          {portfolio.symbols.includes(symbol) ? (
            <Button
              icon={<Trash2 className="h-5" color="white" />}
              onClick={() => handleClick(portfolio.id, "remove")}
              color="red"
              loading={loading.includes(portfolio.id)}
              className={`w-full h-full absolute top-0 left-0 ${
                !loading.includes(portfolio.id) ? "opacity-0" : "opacity-50"
              } hover:opacity-50`}
            />
          ) : (
            <Button
              icon={<Plus className="h-6" color="white" />}
              onClick={() => handleClick(portfolio.id, "add")}
              color="green"
              loading={loading.includes(portfolio.id)}
              className="w-full h-full absolute top-0 left-0 opacity-0 hover:opacity-50"
            />
          )}
        </div>
      ))}
    </div>
  );
}
