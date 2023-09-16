"use client";

import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { startTransition, useCallback, useState } from "react";
import { Prisma, Stock } from "@prisma/client";
import { toast } from "@/hooks/use-toast";
import { ModifySymbolsPortfolioProps } from "@/lib/validators/portfolio";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Pencil, Plus, Trash } from "lucide-react";
import debounce from "lodash.debounce";
import { StockImage } from "../stock/stock-image";
import * as Command from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { PortfolioWithStocks } from "@/types/db";

interface Props {
  portfolio: PortfolioWithStocks;
}

export default function PortfolioAddModal({ portfolio }: Props) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const router = useRouter();

  const request = debounce(async () => {
    refetch();
  }, 300);

  const debounceRequest = useCallback(() => {
    request();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    isFetching,
    data: results,
    refetch,
    isFetched,
  } = useQuery({
    queryFn: async () => {
      if (!search) return [];
      const { data } = await axios.get(`/api/stock/search?q=${search}`);
      const results = data as (Stock & {
        _count: Prisma.StockCountOutputType;
      })[];
      return results.filter((r) => !portfolio.stockIds.includes(r.id));
    },
    queryKey: ["portfolio-search-query"],
    enabled: false,
  });

  const { mutate: addToPortfolio, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: ModifySymbolsPortfolioProps = {
        portfolioId: portfolio.id,
        stockIds: selected,
      };
      await axios.post("/api/portfolio/add", payload);
    },
    onError: () => {
      toast({
        title: "Oops! Something went wrong.",
        description: "Failed to add stocks to portfolio.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => router.refresh());
      toast({ description: "Added stocks to portfolio." });
    },
  });

  function onSubmit() {
    if (selected.length < 1)
      return toast({ description: "Please select atleast one stock." });
    if (selected.length >= 20)
      return toast({ description: "You can only add 20 stocks at a time." });

    addToPortfolio();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="subtle">
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[375px] rounded-md">
        <DialogHeader>
          <DialogTitle>Modify Stock Portfolio</DialogTitle>
          <DialogDescription>
            Here you can add or remove stocks
          </DialogDescription>
        </DialogHeader>
        <Command.Command className="relative rounded-lg max-w-lg z-50 overflow-visible">
          <Command.CommandInput
            isLoading={isFetching}
            onValueChange={(text) => {
              setSearch(text);
              debounceRequest();
            }}
            value={search}
            className="outline-none border-none focus:border-none focus:outline-none ring-0"
            placeholder="Search stocks..."
          />

          {search.length > 0 && (
            <Command.CommandList className="top-full border bg-card inset-x-0 shadow rounded-b-md">
              {isFetched && (
                <Command.CommandEmpty>No results found.</Command.CommandEmpty>
              )}
              {isFetching && (
                <Command.CommandEmpty>
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse-right h-12 rounded-md p-1 px-2"
                    />
                  ))}
                </Command.CommandEmpty>
              )}
              {(results?.length ?? 0) > 0 && (
                <Command.CommandGroup heading="Stocks">
                  {results?.map((result) => (
                    <Command.CommandItem key={result.symbol}>
                      <div className="flex items-center gap-2">
                        <StockImage src={result.image} px={30} />
                        <div className="f-col">
                          <p className="text-sm font-medium">{result.symbol}</p>
                          <p className="w-[250px] text-[12px] text-slate-600">
                            {result.companyName}
                          </p>
                        </div>
                      </div>
                      <div>
                        {selected.includes(result.symbol) ? (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              setSelected(
                                selected.filter((s) => s !== result.symbol)
                              )
                            }>
                            <Trash className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="subtle"
                            size="sm"
                            onClick={() =>
                              setSelected([...selected, result.symbol])
                            }>
                            <Plus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </Command.CommandItem>
                  ))}
                </Command.CommandGroup>
              )}
            </Command.CommandList>
          )}
          <Button
            className="mt-3"
            variant="subtle"
            isLoading={isLoading}
            onClick={onSubmit}>
            <Plus className="h-4 w-4" />
            Add to Portfolio
          </Button>
        </Command.Command>
      </DialogContent>
    </Dialog>
  );
}