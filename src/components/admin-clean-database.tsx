"use client";

import { cleanDb } from "@/lib/stock-update";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { Button, SelectInput } from "@/components/ui";
import { RefreshCcw } from "lucide-react";

export default function AdminCleanDatabase() {
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState("Stocks");

  const onClean = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const loading = toast.loading("Database is being cleaned up...");

    await cleanDb(action)
      .then(() => {
        toast.success("Database cleaned up successfully!", { id: loading });
      })
      .catch((err) =>
        toast.error(`Database couldn't be cleaned up. ${err}`, {
          id: loading,
        })
      );
    setLoading(false);
  };

  return (
    <form
      className="f-col w-[400px] gap-3 rounded-lg bg-slate-100 p-4 px-6 pb-6 shadow-md dark:bg-moon-400"
      onSubmit={onClean}
      method="POST">
      <p className="text-[19px] font-medium">Clean Database</p>

      <SelectInput options={["All", "Stocks"]} onChange={setAction} />

      <Button
        className="mt-2 px-10"
        disabled={loading}
        label="Clean Database"
        color="blue"
        icon={<RefreshCcw className="h-4 w-4" />}
      />
    </form>
  );
}
