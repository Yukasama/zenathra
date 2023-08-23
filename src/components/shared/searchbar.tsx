"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui";
import { Search } from "lucide-react";

interface Props {
  placeholder?: string;
  onChange?: any;
}

export default function Searchbar({ placeholder = "Search", onChange }: Props) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: any) => {
    onChange && onChange(e.target.value);
    setInput(e.target.value);
  };

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    router.replace(`/search?q=${input}`);
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`my-0.5 flex max-w-[380px] flex-1 items-center justify-between rounded-md p-2 px-3 box`}>
      <input
        className="h-full border-none bg-slate-100 outline-none dark:bg-moon-700 lg:w-[300px]"
        value={input}
        placeholder={placeholder}
        onChange={handleChange}
      />
      <Button
        disabled={!input}
        loading={loading}
        icon={<Search className="h-4" />}
      />
    </form>
  );
}
