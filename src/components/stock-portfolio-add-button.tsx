"use client";

import { Button } from "./ui/button";
import ModalForm from "./ui/modal-form";
import { useState } from "react";
import StockPortfolioAddModal from "./stock-portfolio-add-modal";
import type { Session } from "next-auth";
import { Plus } from "lucide-react";
import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { toast } from "@/hooks/use-toast";
import { PortfolioWithStocks } from "@/types/db";

interface Props {
  session: Session | null;
  symbolId: string;
  symbol: string;
  portfolios: PortfolioWithStocks[] | null;
  className?: string;
}

export default function StockPortfolioAddButton({
  session,
  symbolId,
  symbol,
  portfolios,
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const { loginToast } = useCustomToasts();

  const handleClick = () => {
    if (!session) return loginToast();
    if (!portfolios || portfolios.length === 0)
      return toast({ description: "You have to create a portfolio first." });

    setOpen(true);
  };

  return (
    <div className={className}>
      <Button onClick={handleClick}>
        <Plus className="h-4" />
      </Button>
      {portfolios && session?.user && (
        <ModalForm
          title={`Add '${symbol}' to portfolios`}
          isOpen={open}
          onClose={() => setOpen(false)}>
          <StockPortfolioAddModal
            portfolios={portfolios}
            symbolId={symbolId}
          />
        </ModalForm>
      )}
    </div>
  );
}
