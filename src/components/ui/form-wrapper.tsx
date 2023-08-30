"use client";

import { FormEventHandler } from "react";

interface Props {
  title: string;
  children: React.ReactNode;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export default function FormWrapper({ title, children, onSubmit }: Props) {
  return (
    <div className="f-col translate-y-2 gap-3 rounded-xl border border-zinc-200 bg-zinc-400/50 p-10 pb-6 pt-5 md:translate-y-0 min-w-[400px] min-h-[550px]">
      <h2 className="mb-1.5 text-center text-xl font-medium">{title}</h2>
      <form className="f-col gap-5" onSubmit={onSubmit}>
        {children}
      </form>
    </div>
  );
}
