"use client";

import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { ListPlus, ListX, Plus } from "lucide-react";
import debounce from "lodash.debounce";
import StockImage from "../stock/stock-image";
import {
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandDialog,
} from "@/components/ui/command";
import { PortfolioWithStocks } from "@/types/db";
import { trpc } from "@/trpc/client";
import { Spinner } from "@nextui-org/spinner";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  portfolio: Pick<PortfolioWithStocks, "id" | "title" | "stocks">;
}

export default function PortfolioAddModal({ portfolio }: Props) {
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const stocksInPortfolio = new Set(portfolio.stocks.map((s) => s.stockId));

  const request = debounce(async () => refetch(), 300);
  const debounceRequest = useCallback(() => {
    request();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const {
    isFetching,
    data: results,
    refetch,
  } = trpc.stock.search.useQuery(input, { enabled: false });

  const queryClient = useQueryClient();
  const { mutate: addToPortfolio, isLoading } = trpc.portfolio.add.useMutation({
    onError: () => {
      toast({
        title: "Oops! Something went wrong.",
        description: "Failed to add stocks to portfolio.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["portfolio.add"]);
      router.refresh();
    },
  });

  function onSubmit() {
    if (selected.length < 1) {
      return toast({ description: "Please select atleast one stock." });
    } else if (selected.length > 20) {
      return toast({ description: "You can only add 20 stocks at a time." });
    }

    addToPortfolio({
      portfolioId: portfolio.id,
      stockIds: selected,
    });

    setSelected([]);
    setOpen(false);
  }

  function modifyPortfolio(id: string) {
    if (selected.includes(id)) {
      return setSelected(selected.filter((s) => s !== id));
    }

    setSelected([...selected, id]);
  }

  return (
    <>
      <Button
        color="primary"
        onClick={() => setOpen((prev) => (prev === open ? !open : open))}>
        Add New <Plus size={18} />
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          isLoading={isFetching}
          onValueChange={(text) => {
            setInput(text);
            debounceRequest();
          }}
          value={input}
          placeholder="Search stocks..."
        />

        {input.length > 0 && (
          <CommandList key={results?.length}>
            {isFetching ? (
              <CommandEmpty>
                <Spinner />
              </CommandEmpty>
            ) : !results?.length ? (
              <CommandEmpty>No results found.</CommandEmpty>
            ) : (
              <CommandGroup heading="Stocks">
                {results?.map((result) => (
                  <CommandItem
                    key={result.id}
                    disabled={stocksInPortfolio.has(result.id)}
                    onSelect={() => modifyPortfolio(result.id)}
                    value={result.symbol + result.companyName}
                    className={`flex items-center justify-between cursor-pointer ${
                      stocksInPortfolio.has(result.id) && "opacity-50"
                    }`}>
                    <div className="flex items-center gap-2">
                      <StockImage src={result.image} px={30} />
                      <div className="f-col">
                        <p className="text-sm font-medium">{result.symbol}</p>
                        <p className="w-[200px] text-[12px] text-zinc-600">
                          {result.companyName}
                        </p>
                      </div>
                    </div>
                    {selected.includes(result.id) ? (
                      <div className="h-10 w-10 border bg-card f-box bg-red-500 rounded-md">
                        <ListX size={18} />
                      </div>
                    ) : (
                      <div className="h-10 w-10 border bg-card f-box bg-green-500 rounded-md">
                        <ListPlus size={18} />
                      </div>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        )}
        <Button color="primary" isLoading={isLoading} onClick={onSubmit}>
          Add New <Plus size={18} />
        </Button>
      </CommandDialog>
    </>
  );
}
