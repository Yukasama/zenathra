"use client";

import { addToPortfolio } from "@/lib/portfolio/managePortfolio";
import { Button } from "@/components/ui/buttons";
import { Plus, Trash, X } from "react-feather";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/inputs";
import { useEffect, useState } from "react";
import { searchStocks } from "@/lib/stocks/client/getStocks";
import { Portfolio, Stock } from "@prisma/client";
import Image from "next/image";

interface Props {
  portfolio: Portfolio;
  setOpen?: any;
  x?: boolean;
}

export default function AddToPortfolio({
  portfolio,
  setOpen,
  x = true,
}: Props) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Stock[] | null | undefined>([]);
  const [selected, setSelected] = useState<string[]>([]);

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

    x && setOpen(false);
    router.refresh();
  };

  useEffect(() => {
    const fetchResults = async () => {
      const searchResults = await searchStocks(search);
      const merged = portfolio?.symbols
        ? searchResults?.filter((r) => !portfolio.symbols.includes(r.symbol))
        : searchResults;
      setResults(merged);
    };

    if (search.length > 0) fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, results]);

  return (
    <div className="input-window relative mb-20 f-col w-[400px] gap-4 rounded-lg bg-moon-200 p-5">
      <div className={`f-col pl-1`}>
        <h2 className="text-lg font-medium">Add Stocks to Portfolio</h2>
        <h2 className="text-[12px] text-gray-500">
          {selected.length} selected
        </h2>
      </div>
      <Input id="search" onChange={setSearch} label="Search Stocks..." />
      <div className="f-col gap-1">
        {search && (
          <>
            {results?.slice(0, 5).map((result) => (
              <div
                className="flex items-center justify-between rounded-md bg-moon-400 p-1 px-2"
                key={result.symbol}>
                <div className="flex items-center gap-2">
                  <div className="image h-[30px] w-[30px]">
                    <Image
                      src={result.image}
                      height={30}
                      width={30}
                      alt={result.symbol}
                    />
                  </div>
                  <div className="f-col">
                    <p className="text-sm font-medium">{result.symbol}</p>
                    <p className="w-[250px] text-[12px] text-gray-600">
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
                        setSelected(selected.filter((s) => s !== result.symbol))
                      }
                    />
                  ) : (
                    <Button
                      icon={<Plus className="h-4 w-4" />}
                      color="green"
                      onClick={() => setSelected([...selected, result.symbol])}
                      outline
                    />
                  )}
                </div>
              </div>
            ))}
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
      {x && (
        <button
          onClick={() => setOpen(false)}
          className="absolute right-3 top-3">
          <X />
        </button>
      )}
    </div>
  );
}
