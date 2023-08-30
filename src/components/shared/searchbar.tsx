"use client";

import { Prisma, Stock } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import debounce from "lodash.debounce";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import * as Command from "@/components/ui/command";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import Link from "next/link";

export default function Searchbar() {
  const [input, setInput] = useState<string>("");
  const pathname = usePathname();
  const commandRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useOnClickOutside(commandRef, () => {
    setInput("");
  });

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
      if (!input) return [];
      const { data } = await axios.get(`/api/stock/search?q=${input}`);
      return data as (Stock & {
        _count: Prisma.StockCountOutputType;
      })[];
    },
    queryKey: ["search-query"],
    enabled: false,
  });

  useEffect(() => {
    setInput("");
  }, [pathname]);

  return (
    <Command.Command
      ref={commandRef}
      className="relative rounded-md border max-w-lg z-50 overflow-visible">
      <Command.CommandInput
        isLoading={isFetching}
        onValueChange={(text) => {
          setInput(text);
          debounceRequest();
        }}
        value={input}
        className="outline-none border-none focus:border-none focus:outline-none ring-0 shadow-none"
        placeholder="Search stocks..."
      />

      {input.length > 0 && (
        <Command.CommandList className="absolute top-full border bg-card inset-x-0 shadow rounded-b-md">
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
          {(queryResults?.length ?? 0) > 0 && (
            <Command.CommandGroup heading="Stocks">
              {queryResults?.map((stock) => (
                <Command.CommandItem
                  onSelect={(e) => {
                    router.push(`/r/${e}`);
                    router.refresh();
                  }}
                  key={stock.id}
                  value={stock.companyName}>
                  <Link href={`/stocks/${stock.symbol}`}>{stock.symbol}</Link>
                </Command.CommandItem>
              ))}
            </Command.CommandGroup>
          )}
        </Command.CommandList>
      )}
    </Command.Command>
  );
}
