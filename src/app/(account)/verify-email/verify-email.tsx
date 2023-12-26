"use client";

import { toast } from "sonner";
import { CheckCircle, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/react";
import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { trpc } from "@/trpc/client";
import { TRPCError } from "@trpc/server";

export default function VerifyEmail() {
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const { defaultError } = useCustomToasts();

  useEffect(() => {
    setMounted(true);

    if (token?.length > 0) {
      verifyEmail(token);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    mutate: verifyEmail,
    isLoading,
    isSuccess,
  } = trpc.user.verify.useMutation({
    onError: (err) => {
      if (err instanceof TRPCError && err.code === "NOT_FOUND") {
        return toast.error("Email verification not found or expired.");
      }
      defaultError();
    },
    onSuccess: () => {
      toast.success("Email verified successfully.");
      router.push("/");
    },
  });

  return (
    <div className="text-xl">
      {isLoading || !mounted ? (
        <div className="f-col gap-2">
          <div className="h-10 w-10 f-box self-center">
            <Spinner />
          </div>
          Verifying Email...
        </div>
      ) : isSuccess ? (
        <div className="f-col gap-2">
          <div className="bg-green-500 h-10 w-10 f-box self-center rounded-full">
            <CheckCircle />
          </div>
          <div className="f-col items-center">
            Email verified successfully!
            <p className="text-zinc-400 text-[16px]">
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
            Something went wrong.
            <p className="text-zinc-400 text-[16px]">
              No or invalid token provided.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
