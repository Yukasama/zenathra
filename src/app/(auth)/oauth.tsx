"use client";

import { SignInResponse, signIn } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";
import { useMutation } from "@tanstack/react-query";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  provider: "google" | "facebook" | "github";
}

export default function OAuth({ provider, className, ...props }: Props) {
  const { mutate: login, isLoading } = useMutation({
    mutationFn: async () => {
      const response = await signIn(provider);
      if (response?.error) throw new Error(response?.error);
      return response as SignInResponse;
    },
    onError: (err: string) =>
      toast({
        title: "We have trouble signing you in.",
        description: `${err ?? "Please try again later."}`,
        variant: "destructive",
      }),
    onSettled: (res, resp) => {
      if (!resp) window.location.reload();
    },
  });

  return (
    <div className={cn("flex justify-center w-full", className)} {...props}>
      <Button
        isLoading={isLoading}
        className="w-full bg-slate-900 hover:bg-slate-900/70 border"
        onClick={() => login()}>
        {provider === "google" ? (
          <Icons.google className="h-[18px] mr-1" />
        ) : provider === "facebook" ? (
          <Icons.facebook className="h-[18px] mr-1" />
        ) : (
          <Icons.github className="dark:invert h-[18px] mr-1" />
        )}
        {provider[0].toUpperCase() + provider.slice(1)}
      </Button>
    </div>
  );
}
