"use client";

import debounce from "lodash.debounce";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
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
import { Loader, Search } from "lucide-react";
import { RecentStocks } from "@/types/db";
import { cn } from "@/lib/utils";
import { trpc } from "@/app/_trpc/client";
import { buttonVariants } from "../ui/button";
import { motion } from "framer-motion";
import { ANIMATION_VARIANTS } from "@/config/motion";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  recentStocks: RecentStocks | null;
  responsive?: boolean;
}

export default function Searchbar({
  recentStocks,
  responsive = true,
  className,
  ...props
}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const [input, setInput] = useState<string>("");
  const [isMac, setIsMac] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

  let recentlyViewed = recentStocks?.map((stock) => stock.stock);

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
    setOpen(false);
    setInput("");
  }, [pathname]);

  useEffect(() => {
    setIsMac(navigator.userAgent.toUpperCase().includes("MAC"));
  }, []);

  const request = debounce(async () => {
    refetch();

    if (recentStocks)
      recentlyViewed = recentStocks
        .filter(
          (stock) =>
            stock.stock.symbol.includes(input) ||
            stock.stock.companyName.includes(input)
        )
        .map((stock) => stock.stock);
  }, 300);

  const debounceRequest = useCallback(() => {
    request();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    isFetching,
    data: results,
    refetch,
  } = trpc.stock.search.useQuery(input, { enabled: false });

  return (
    <>
      <motion.div
        variants={ANIMATION_VARIANTS}
        whileTap="tap"
        className={cn(
          `bg-gradient-to-br from-[#dd6942] to-[#e09c4e] text-white p-2 px-3 rounded-md ${
            responsive ? "hidden md:flex" : "flex"
          }  items-center justify-between w-60 cursor-pointer`,
          className
        )}
        onClick={() => setOpen((prev) => (prev === open ? !open : open))}>
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          <p className="text-[14px]">Search stocks...</p>
        </div>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-[3px] rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground opacity-100">
          <span className={`${!isMac && "text-[10px]"} mt-[1px]`}>
            {!isMac ? "Strg" : "⌘"}
          </span>
          K
        </kbd>
      </motion.div>
      <div
        onClick={() => setOpen((prev) => (prev === open ? !open : open))}
        className={cn(
          buttonVariants({
            variant: "link",
            size: "sm",
          }),
          `${responsive ? "flex md:hidden" : "hidden"} border cursor-pointer`
        )}
        {...props}>
        <Search className="h-[18px]" />
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
            {(recentlyViewed?.length ?? 0) > 0 && (
              <CommandGroup heading="Recently Viewed">
                {recentlyViewed?.map((stock) => (
                  <Link key={stock.symbol} href={`/stocks/${stock.symbol}`}>
                    <CommandItem
                      onSelect={() => {
                        router.push(`/stocks/${stock.symbol}`);
                        router.refresh();
                      }}
                      value={stock.companyName}
                      className="flex items-center gap-3 h-14 cursor-pointer">
                      <StockImage src={stock.image} px={25} />
                      <div>
                        <p className="font-medium">{stock.symbol}</p>
                        <p className="text-[12px] text-zinc-500 truncate w-[150px]">
                          {stock.companyName}
                        </p>
                      </div>
                    </CommandItem>
                  </Link>
                ))}
              </CommandGroup>
            )}
            {isFetching ? (
              <div className="p-5 f-box">
                <Loader className="h-5 w-5 animate-spin text-zinc-500 text-center" />
              </div>
            ) : !results?.length ? (
              <CommandEmpty>No results found.</CommandEmpty>
            ) : (
              <>
                {(results?.length ?? 0) > 0 && (
                  <CommandGroup key={results?.length} heading="Stocks">
                    {results?.map((stock, i) => (
                      <Link key={"search" + i} href={`/stocks/${stock.symbol}`}>
                        <CommandItem
                          onSelect={() => {
                            router.push(`/stocks/${stock.symbol}`);
                            router.refresh();
                          }}
                          value={stock.companyName}
                          className="flex items-center gap-3 h-14 cursor-pointer">
                          <StockImage src={stock.image} px={25} />
                          <div>
                            <p className="font-medium">{stock.symbol}</p>
                            <p className="text-[12px] text-zinc-500 truncate w-[150px]">
                              {stock.companyName}
                            </p>
                          </div>
                        </CommandItem>
                      </Link>
                    ))}
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        )}
      </CommandDialog>
    </>
  );
}
