"use client";

import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { startTransition, useCallback, useState } from "react";
import { Portfolio, Prisma, Stock } from "@prisma/client";
import { toast } from "@/hooks/use-toast";
import { ModifySymbolsPortfolioProps } from "@/lib/validators/portfolio";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Plus, Trash } from "lucide-react";
import debounce from "lodash.debounce";
import { StockImage } from "./shared/stock-image";
import * as Command from "@/components/ui/command";

interface Props {
  portfolio: Portfolio;
  stockIds: string[];
  onClose?: any;
}

export default function PortfolioAddModal({
  portfolio,
  stockIds,
  onClose,
}: Props) {
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
    data: queryResults,
    refetch,
    isFetched,
  } = useQuery({
    queryFn: async () => {
      if (!search) return [];
      const { data } = await axios.get(`/api/search?q=${search}`);
      const results = data as (Stock & {
        _count: Prisma.StockCountOutputType;
      })[];
      return results.filter((r) => {
        !stockIds.includes(r.id);
      });
    },
    queryKey: ["search-query"],
    enabled: false,
  });

  const { mutate: addToPortfolio, isLoading } = useMutation({
    mutationFn: async () => {
      if (selected.length < 1)
        return toast({ description: "Please select atleast one stock." });
      if (selected.length >= 20)
        return toast({ description: "You can only add 20 stocks at a time." });

      const payload: ModifySymbolsPortfolioProps = {
        portfolioId: portfolio.id,
        stockIds: selected,
      };
      await axios.post("/api/portfolio/add", payload);
    },
    onError: () => {
      toast({
        title: "Oops! Something went wrong.",
        description: `Failed to add stocks to portfolio.`,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => router.refresh());
      onClose();

      toast({
        description: `Added stocks to portfolio.`,
      });
    },
  });

  return (
    <Command.Command className="relative rounded-lg border max-w-lg z-50 overflow-visible">
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
        <Command.CommandList className="absolute bg-white top-full inset-x-0 shadow rounded-b-md">
          {isFetched && (
            <Command.CommandEmpty>No results found.</Command.CommandEmpty>
          )}
          {(queryResults?.length ?? 0) > 0 ? (
            <Command.CommandGroup heading="Stocks">
              {queryResults?.map((result) => (
                <Command.CommandItem
                  className="flex items-center justify-between rounded-md bg-zinc-400 p-1 px-2 h-12"
                  key={result.symbol}>
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
                        onClick={() =>
                          setSelected(
                            selected.filter((s) => s !== result.symbol)
                          )
                        }>
                        <Trash className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
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
          ) : (
            <>
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse-right h-12 rounded-md p-1 px-2"
                />
              ))}
            </>
          )}
        </Command.CommandList>
      )}
      <Button isLoading={isLoading} onClick={() => addToPortfolio()}>
        <Plus className="h-4 w-4" />
        Add to Portfolio
      </Button>
    </Command.Command>
  );
}
