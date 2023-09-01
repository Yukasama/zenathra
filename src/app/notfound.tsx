"use client";

export default function error() {
  return (
    <div className="f-box mt-80">
      <div className="f-col gap-2.5">
        <h2 className="text-zinc-600 dark:text-zinc-400 text-lg">
          Not Found Error
        </h2>
        <p className="text-slate-400 dark:text-slate-200 text-sm">
          This page could not be found.
        </p>
      </div>
    </div>
  );
}
