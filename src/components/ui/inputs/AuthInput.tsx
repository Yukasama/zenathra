"use client";

import { ReactNode } from "react";
import { AlertCircle } from "react-feather";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface Props {
  id: string;
  label: string;
  type: string;
  register: UseFormRegister<FieldValues>;
  errors?: FieldErrors;
}

export default function AuthInput({
  id,
  label,
  type,
  register,
  errors,
}: Props) {
  return (
    <div className="f-col relative gap-1">
      <input
        id={id}
        type={type}
        {...register(id)}
        className={`text group w-full rounded-md border border-gray-300/60 bg-gray-100 p-3.5 pb-3 pt-4 text-sm outline-none transition-border duration-300 focus:border-blue-500 dark:border-moon-100 dark:bg-moon-300 ${
          errors && errors[id] && "border-red-500"
        }`}
      />
      <label
        htmlFor={id}
        className={`absolute left-4 top-[13px] cursor-text text-gray-700 duration-200 
            ${"translate-x-[-2px] translate-y-[-11px] text-[11px]"}`}>
        {label}
      </label>
      {errors && errors[id] && (
        <div className="flex items-center">
          <AlertCircle className="h-4 text-red-500" />
          <div className={`text-[12px] text-red-500`}>
            {errors[id]!.message as ReactNode}
          </div>
        </div>
      )}
    </div>
  );
}
