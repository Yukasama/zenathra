"use client";

import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import { startTransition, useCallback, useRef, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { ListPlus, ListX, Plus } from "lucide-react";
import debounce from "lodash.debounce";
import { StockImage } from "../stock/stock-image";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { PortfolioWithStocks } from "@/types/db";
import { trpc } from "@/app/_trpc/client";
import { DialogClose } from "@radix-ui/react-dialog";

interface Props {
  portfolio: Pick<PortfolioWithStocks, "id" | "title" | "stocks">;
}

export default function PortfolioAddModal({ portfolio }: Props) {
  const [input, setInput] = useState<string>("");
  const [selected, setSelected] = useState<string[]>([]);

  const router = useRouter();
  const commandRef = useRef<HTMLDivElement>(null);
  const request = debounce(async () => refetch(), 300);

  const debounceRequest = useCallback(() => {
    request();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    isFetching,
    data: results,
    refetch,
    isFetched,
  } = trpc.stock.search.useQuery(input, { enabled: false });

  const filteredResults = results?.filter(
    (r) => !portfolio.stocks.map((s) => s.stockId === r.id)
  );

  const { mutate: addToPortfolio, isLoading } = trpc.portfolio.add.useMutation({
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
    if (selected.length < 1) {
      return toast({ description: "Please select atleast one stock." });
    } else if (selected.length > 20) {
      return toast({ description: "You can only add 20 stocks at a time." });
    }

    addToPortfolio({
      portfolioId: portfolio.id,
      stockIds: selected,
    });
  }

  function modifyPortfolio(id: string) {
    if (selected.includes(id)) {
      return setSelected(selected.filter((s) => s !== id));
    }

    setSelected([...selected, id]);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-primary">
          Add New <Plus size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[375px] rounded-md">
        <DialogHeader>
          <DialogTitle>Add stocks to {portfolio.title}</DialogTitle>
          <DialogDescription>
            Here you can add stocks to your portfolio
          </DialogDescription>
        </DialogHeader>
        <Command
          ref={commandRef}
          key={results?.length}
          className="rounded-md border">
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
            <CommandList autoFocus={false} key={filteredResults?.length}>
              {isFetching && (
                <CommandEmpty>
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse-right h-12 rounded-md p-1 px-2"
                    />
                  ))}
                </CommandEmpty>
              )}
              {isFetched && !filteredResults?.length && (
                <CommandEmpty>No results found.</CommandEmpty>
              )}
              {isFetched && (filteredResults?.length ?? 0) > 0 && (
                <CommandGroup autoFocus={false} heading="Stocks">
                  {filteredResults?.map((result) => (
                    <CommandItem
                      key={result.id}
                      autoFocus={false}
                      onSelect={() => modifyPortfolio(result.id)}
                      className="flex items-center justify-between cursor-pointer">
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
                          <ListX className="h-4 w-4" />
                        </div>
                      ) : (
                        <div className="h-10 w-10 border bg-card f-box bg-green-500 rounded-md">
                          <ListPlus className="h-4 w-4" />
                        </div>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          )}
        </Command>
        <DialogClose>
          <Button color="primary" isLoading={isLoading} onClick={onSubmit}>
            Add New <Plus size={18} />
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
