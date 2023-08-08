"use client";

import { createStocks } from "@/lib/stocks/server/manageStocks";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { SelectInput, Checkbox } from "@/components/ui/inputs";
import { Button } from "@/components/ui/buttons";
import { Plus } from "react-feather";

export default function AddStocks() {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState("All");
  const [skip, setSkip] = useState(false);
  const [clean, setClean] = useState(true);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const loading = toast.loading(
      `${selected} ${selected !== "All" ? "is" : "files"} being added...`
    );

    const pullTimes = 100;
    await createStocks(selected, skip, clean, pullTimes)
      .then(() => {
        toast.success(`${selected} added successfully!`, { id: loading });
      })
      .catch(() =>
        toast.error(`${selected} could not be added!`, { id: loading })
      );

    setLoading(false);
  };

  return (
    <form
      className="f-col w-[400px] gap-3 rounded-lg bg-gray-100 p-4 px-6 pb-6 shadow-md dark:bg-moon-400"
      onSubmit={onSubmit}
      method="POST">
      <p className="text-[19px] font-medium">Push Symbols</p>

      <SelectInput
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
        <Checkbox heading="Skipping Stocks" label="Skips already added symbols" onChange={setSkip} />
        <Checkbox heading="Clean Database" label="Cleans the database of empty records" onChange={setClean} />
      </div>

      <Button
        className="px-10"
        disabled={loading}
        label="Add Stocks"
        icon={<Plus className="h-4 w-4" />}
      />
    </form>
  );
}
