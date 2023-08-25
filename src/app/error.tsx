"use client";

export default function error() {
  return (
    <div className="f-box">
      <div className="f-col gap-2.5">
        <h2 className="text-zinc-600 text-lg">Internal Server Error</h2>
        <p className="text-slate-600">
          There was an error on our end. Please try again later.
        </p>
      </div>
    </div>
  );
}
