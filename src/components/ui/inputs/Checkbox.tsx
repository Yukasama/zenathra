"use client";

import { useState } from "react";
import { Check } from "react-feather";

interface Props {
  heading: string;
  label: string;
  onChange: Function;
  defaultChecked?: boolean;
  className?: string;
}

export default function Checkbox({
  heading,
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
    <div className={`flex gap-2.5 ${className}`}>
      <button
        className={`${
          checked ? "bg-blue-500" : "border border-blue-500"
        } f-box h-5 w-5 rounded-sm mt-0.5`}
        onClick={handleChange}>
        <Check className={`${checked ? "flex" : "hidden"} h-4 w-4`} />
      </button>
      <div className="f-col gap-0.5">
        <p className="text-md font-medium">{heading}</p>
        <p className="text-sm text-gray-400">{label}</p>
      </div>
    </div>
  );
}
