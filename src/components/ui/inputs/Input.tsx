"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  label: string;
  onChange: Function;
  type?: string;
  id: string;
  heading?: string;
  subheading?: string;
  disabled?: boolean;
  required?: boolean;
  focus?: boolean;
}

export default function Input({
  id,
  type = "text",
  onChange,
  label,
  heading,
  subheading,
  disabled = false,
  required = true,
  focus = false,
}: Props) {
  const [input, setInput] = useState("");
  const [inputFocus, setInputFocus] = useState(false);

  const ref: any = useRef();

  useEffect(() => {
    focus && ref.current.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e: any) => {
    onChange(e.target.value);
    setInput(e.target.value);
  };

  return (
    <div>
      <p
        className={`text-md font-medium ml-0.5 ${!heading && "hidden"} ${
          heading && !subheading && "mb-1"
        }`}>
        {heading}
      </p>
      <p
        className={`text-sm text-gray-400 mb-1.5 ml-0.5 ${
          !subheading && "hidden"
        }`}>
        {subheading}
      </p>
      <div className="relative">
        <input
          className={`input ${
            inputFocus && "border-blue-500 dark:border-blue-500"
          } text-sm`}
          type={type}
          id={id}
          ref={ref}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          autoComplete="password"
          onFocus={() => setInputFocus(true)}
          onBlur={() => setInputFocus(false)}
        />
        <label
          htmlFor={id}
          className={`absolute left-4 top-[13px] cursor-text text-gray-700 duration-200 
            ${
              (input || inputFocus) &&
              "translate-x-[-2px] translate-y-[-11px] text-[11px]"
            }`}>
          {label}
        </label>
      </div>
    </div>
  );
}
