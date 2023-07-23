"use client";

import { useState } from "react";
import { Check } from "react-feather";

interface Props {
  label: string;
  onChange: Function;
  defaultChecked?: boolean;
  className?: string;
}

export default function Checkbox({
  label,
  onChange,
  defaultChecked,
  className,
}: Props) {
  if (!defaultChecked) defaultChecked = false;
  const [checked, setChecked] = useState<boolean>(defaultChecked);

  const handleChange = () => {
    setChecked(!checked);
    onChange && onChange(!checked);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className={`${
          checked ? "bg-blue-500" : "border border-blue-500"
        } flex-box h-5 w-5 cursor-pointer rounded-sm`}
        onClick={handleChange}>
        <Check className={`${checked ? "flex" : "hidden"} h-4 w-4`} />
      </div>
      <p className="text-sm text-gray-800">{label}</p>
    </div>
  );
}
