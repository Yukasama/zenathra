"use client";

import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { CheckCircle, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import { Spinner } from "@nextui-org/spinner";
import { useCustomToasts } from "@/hooks/use-custom-toasts";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { defaultError } = useCustomToasts();

  const token = searchParams.get("token") ?? "";

  useEffect(() => {
    setMounted(true);
    if (token?.length > 0) verifyEmail();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    mutate: verifyEmail,
    isLoading,
    isSuccess,
  } = useMutation({
    mutationFn: async () =>
      await axios.post("/api/user/verify-email", { token }),
    onError: (err) => {
      if (err instanceof AxiosError && err.response?.status === 404)
        return toast({
          title: "Oops! Something went wrong.",
          description: "Email verification not found or expired.",
          variant: "destructive",
        });
      defaultError();
    },
    onSuccess: () => {
      startTransition(() => router.push("/"));
      toast({ description: "Email verified successfully." });
    },
  });

  return (
    <div className="text-xl">
      {isLoading || !mounted ? (
        <div className="f-col gap-2">
          <div className="h-10 w-10 f-box self-center">
            <Spinner />
          </div>
          <p>Verifying Email...</p>
        </div>
      ) : isSuccess ? (
        <div className="f-col gap-2">
          <div className="bg-green-500 h-10 w-10 f-box self-center rounded-full">
            <CheckCircle />
          </div>
          <div className="f-col items-center">
            <p>Email verified successfully!</p>
            <p className="text-slate-400 text-[16px]">
              You&apos;re being redirected...
            </p>
          </div>
        </div>
      ) : (
        <div className="f-col gap-2">
          <div className="bg-red-500 h-10 w-10 f-box self-center rounded-full">
            <X />
          </div>
          <div className="f-col items-center">
            <p>Something went wrong.</p>
            <p className="text-slate-400 text-[16px]">
              No or invalid token provided.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}