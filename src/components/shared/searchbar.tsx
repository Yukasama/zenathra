"use client";

import { Prisma, Stock } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import debounce from "lodash.debounce";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { StockImage } from "../stock/stock-image";
import {
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandDialog,
} from "../ui/command";
import { Loader, Loader2, Search } from "lucide-react";

export default function Searchbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [input, setInput] = useState<string>("");
  const [open, setOpen] = useState(false);

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

  useEffect(() => {
    setInput("");
  }, [pathname]);

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
      if (!input) return [];
      const { data } = await axios.get(`/api/stock/search?q=${input}`);
      return data as (Stock & {
        _count: Prisma.StockCountOutputType;
      })[];
    },
    queryKey: ["search-query"],
    enabled: false,
  });

  console.log(results);

  return (
    <>
      <div
        className="border text-slate-400 p-2 rounded-md flex items-center justify-between w-60 cursor-pointer"
        onClick={() => setOpen((prev) => (prev === open ? !open : open))}>
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          <p className="text-[14px]">Search stocks...</p>
        </div>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          isLoading={isFetching}
          onValueChange={(text) => {
            setInput(text);
            debounceRequest();
          }}
          value={input}
          className="h-9"
          placeholder="Search stocks..."
        />

        {input.length > 0 && (
          <CommandList key={results?.length} className="f-col gap-1">
            {true ? (
              <CommandEmpty>
                <Loader className="h-5 w-5 animate-spin text-slate-500 text-center p-3" />
              </CommandEmpty>
            ) : !results?.length ? (
              <CommandEmpty>No results found.</CommandEmpty>
            ) : (
              (results?.length ?? 0) > 0 && (
                <CommandGroup key={results?.length} heading="Stocks">
                  {results?.map((stock) => (
                    <CommandItem
                      onSelect={() => {
                        router.push(`/stocks/${stock.symbol}`);
                        router.refresh();
                      }}
                      key={stock.id}
                      value={stock.companyName}>
                      <Link
                        className="flex items-center gap-3 h-9"
                        href={`/stocks/${stock.symbol}`}>
                        <StockImage src={stock.image} px={25} />
                        <div>
                          <p className="font-medium">{stock.symbol}</p>
                          <p className="text-[12px] text-slate-500 truncate w-[150px]">
                            {stock.companyName}
                          </p>
                        </div>
                      </Link>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )
            )}
          </CommandList>
        )}
      </CommandDialog>
    </>
  );
}
