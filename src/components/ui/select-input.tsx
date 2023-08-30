"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Props {
  label?: string;
  options: any[];
  onChange: Function;
  relative?: boolean;
  reset?: number;
}

export default function SelectInput({
  label,
  options,
  onChange,
  relative,
  reset,
}: Props) {
  const [option, setOption] = useState<string>(options[0] || "");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  useEffect(() => {
    setOption("Any");
    onChange && onChange("Any");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset]);

  const handleChange = (value: string) => {
    setOption(value);
    onChange && onChange(value);
  };

  return (
    <div className="w-full">
      <p className="mb-[1px] ml-[1px] font-medium">{label}</p>
      <div
        ref={dropdownRef}
        className="relative cursor-pointer rounded-lg border border-slate-200 dark:border-zinc-100"
        onClick={() => setIsOpen(!isOpen)}>
        <ChevronDown
          className={`absolute right-4 top-[14px] h-4 w-4 transition-transform ${
            isOpen && "rotate-180"
          }`}
        />
        <div className="rounded-lg p-3 px-4 pr-10 text-sm">{option}</div>
        {isOpen && (
          <div
            className={`${
              !relative && "absolute"
            } hidden-scrollbar bg-white dark:bg-slate-800 z-10 mt-1 max-h-[202px] w-full overflow-y-auto rounded-lg border border-slate-200 shadow-lg dark:border-zinc-300`}>
            {options.map((option, index) => (
              <div
                className="z-10 cursor-pointer bg-slate-100 px-4 py-2 text-sm hover:bg-slate-200 dark:bg-zinc-400 dark:hover:bg-zinc-200"
                key={option + index}
                onClick={() => handleChange(option)}>
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
