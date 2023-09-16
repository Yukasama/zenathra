"use client";

import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { CheckCircle, X } from "lucide-react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import { Spinner } from "@nextui-org/spinner";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

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
    mutationFn: async () => {
      await axios.post("/api/user/verify-email", { token });
    },
    onError: () => {
      toast({
        title: "Oops! Something went wrong.",
        description: `Email verification not found or no longer active.`,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => router.refresh());

      toast({
        description: `Email verified successfully.`,
      });
      redirect("/");
    },
  });

  return (
    <div className="mt-60 text-center text-xl font-thin relative">
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
          <p>Email verified successfully!</p>
        </div>
      ) : (
        <div className="f-col gap-2">
          <div className="bg-red-500 h-10 w-10 f-box self-center rounded-full">
            <X />
          </div>
          <p>Something went wrong.</p>
        </div>
      )}
    </div>
  );
}
