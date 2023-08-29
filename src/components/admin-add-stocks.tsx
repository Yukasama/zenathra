"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { UploadStockProps } from "@/lib/validators/stock";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { Select } from "./ui/select";
import { Checkbox } from "./ui/checkbox";

export default function AdminAddStocks() {
  const [selected, setSelected] = useState("All");
  const [skip, setSkip] = useState(false);
  const [clean, setClean] = useState(true);

  const { mutate: uploadStocks, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: UploadStockProps = {
        symbol: selected,
        skip,
        clean,
        pullTimes: 10,
      };

      await axios.post("/api/stock/upload", payload);
    },
    onError: () => {
      toast({
        title: "Oops! Something went wrong.",
        description: `Stocks could not be uploaded.`,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Stocks uploaded.",
        description: `Files were successfully added to the database.`,
      });
    },
  });

  return (
    <form
      className="f-col w-[400px] gap-3 rounded-lg bg-slate-100 p-4 px-6 pb-6 shadow-md dark:bg-moon-400"
      onSubmit={() => uploadStocks()}
      method="POST">
      <p className="text-[19px] font-medium">Push Symbols</p>

      <Select
        options={[
          "All",
          "US500",
          "AAPL",
          "MSFT",
          "META",
          "GOOG",
          "FIE.DE",
          "TSLA",
          "NVDA",
          "AMZN",
          "AMD",
          "AI",
        ]}
        onChange={setSelected}
      />
      <div className="my-1 f-col gap-2.5">
        <Checkbox
          heading="Skipping Stocks"
          label="Skips already added symbols"
          onChange={setSkip}
        />
        <div className="items-top flex space-x-2">
          <Checkbox id="skip" onChange={() => setSkip((prev) => )} />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="skip"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Skipping Stocks
            </label>
            <p className="text-sm text-muted-foreground">
              Skips already added symbols
            </p>
          </div>
        </div>
        <Checkbox
          heading="Clean Database"
          label="Cleans the database of empty records"
          onChange={setClean}
        />
      </div>

      <Button
        className="px-10"
        disabled={isLoading}
        label="Add Stocks"
        icon={<Plus className="h-4 w-4" />}
      />
    </form>
  );
}
