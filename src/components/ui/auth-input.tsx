"use client";

import { AlertCircle } from "lucide-react";
import { ReactNode } from "react";
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
        className={`input group ${errors && errors[id] && "border-red-500"}`}
      />
      <label
        htmlFor={id}
        className={`absolute left-4 top-[13px] cursor-text text-slate-700 duration-200 
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
