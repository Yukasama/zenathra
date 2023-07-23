"use client";

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function Form({ title, children }: Props) {
  return (
    <div className="f-col translate-y-2 gap-3 rounded-xl border border-moon-200 bg-moon-400/50 p-10 pb-6 pt-5 md:translate-y-0 min-w-[400px] min-h-[550px]">
      <h2 className="mb-1.5 text-center text-xl font-medium">{title}</h2>
      {children}
    </div>
  );
}
