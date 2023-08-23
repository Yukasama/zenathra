"use client";

import { Button, Input } from "@/components/ui";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Stock } from "@prisma/client";
import { Portfolio } from "@/types/db";
import Image from "next/image";
import { useDebounce } from "@/lib/utils";

interface Props {
  portfolio: Portfolio;
  onClose?: any;
}

export default function PortfolioAddModal({ portfolio, onClose }: Props) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Stock[] | null | undefined>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleClick = async () => {
    if (selected.length < 1)
      return toast.error("Please select atleast one stock.");
    if (selected.length >= 20)
      return toast.error("Please select less than 20 stock.");

    const { error } = await addToPortfolio(selected, portfolio.id);
    if (error) {
      toast.error("Failed to add stocks to portfolio.");
    } else {
      toast.success("Added stocks to portfolio.");
    }

    onClose();
    router.refresh();
  };

  const debouncedSearch = useDebounce(search, 200);

  useEffect(() => {
    let isCancelled = false;

    const fetchResults = async () => {
      const searchResults = await searchStocks(debouncedSearch);
      if (isCancelled) return;

      const merged = portfolio?.symbols
        ? searchResults?.filter((r) => !portfolio.symbols.includes(r.symbol))
        : searchResults;
      setResults(merged);

      setLoading(false);
    };

    if (debouncedSearch.length > 0) {
      setLoading(true);
      fetchResults();
    }

    return () => {
      isCancelled = true;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  return (
    <>
      <Input
        id="search"
        onChange={setSearch}
        heading="Search Stocks"
        subheading="Search companies by name or ticker"
        label="Enter company name..."
      />
      <div className="f-col gap-1">
        {search && (
          <>
            {!loading ? (
              <>
                {results?.slice(0, 4).map((result) => (
                  <div
                    className="flex items-center justify-between rounded-md bg-moon-400 p-1 px-2 h-12"
                    key={result.symbol}>
                    <div className="flex items-center gap-2">
                      <div className="image h-[30px] w-[30px]">
                        <Image
                          src={result.image}
                          height={30}
                          width={30}
                          alt={result.symbol + "Logo"}
                        />
                      </div>
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
                          icon={<Trash className="h-4 w-4" />}
                          color="red"
                          onClick={() =>
                            setSelected(
                              selected.filter((s) => s !== result.symbol)
                            )
                          }
                        />
                      ) : (
                        <Button
                          icon={<Plus className="h-4 w-4" />}
                          color="green"
                          onClick={() =>
                            setSelected([...selected, result.symbol])
                          }
                          outline
                        />
                      )}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse-right h-12 rounded-md
                p-1 px-2"></div>
                ))}
              </>
            )}
          </>
        )}
      </div>
      <Button
        icon={<Plus className="h-4 w-4" />}
        label="Add Stocks"
        color="green"
        onClick={handleClick}
        outline
      />
    </>
  );
}
