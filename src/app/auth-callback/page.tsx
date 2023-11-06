"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "../_trpc/client";
import Link from "next/link";
import { Spinner } from "@nextui-org/spinner";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  trpc.user.authCallback.useQuery(undefined, {
    onError: (err) => {
      if (err.data?.code === "UNAUTHORIZED") {
        router.push("/sign-in");
      }
    },
    onSuccess: ({ success }) => {
      if (success) router.push(origin ? `/${origin}` : "/");
    },
    retry: true,
    retryDelay: 500,
    enabled: true,
  });

  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Spinner />
        <h3 className="font-semibold text-xl">Setting up your account...</h3>
        <p>You will be redirected automatically.</p>
        <Link href="/" className="text-zinc-400 text-sm hover:underline">
          Not redirected automatically?
        </Link>
      </div>
    </div>
  );
}
