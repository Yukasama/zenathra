"use client";

import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  return (
    <div className="mt-52 text-center text-3xl font-thin">Coming soon...</div>
  );
}
