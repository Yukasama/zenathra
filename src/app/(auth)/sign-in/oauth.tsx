"use client";

import { signIn } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import { capitalize, cn } from "@/lib/utils";
import { Button } from "@nextui-org/button";
import { Icons } from "@/components/shared/icons";
import { useMutation } from "@tanstack/react-query";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  provider: "google" | "facebook" | "github";
}

const providerIcons = {
  google: <Icons.google className="h-[18px]" />,
  facebook: <Icons.facebook className="h-[18px]" />,
  github: <Icons.github className="dark:invert h-[18px]" />,
};

export default function OAuth({ provider, className }: Props) {
  const { mutate: login, isLoading } = useMutation({
    mutationFn: async () => await signIn(provider),
    onError: () => {
      toast({
        title: "We have trouble signing you in.",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  return (
    <Button
      isLoading={isLoading}
      className={cn(
        "bg-zinc-100 hover:bg-zinc-100/70 dark:bg-zinc-950/80 dark:hover:bg-zinc-950/20 border gap-3",
        className
      )}
      onClick={() => login()}>
      {!isLoading && (
        <>
          {providerIcons[provider]}
          Sign in with {capitalize(provider)}
        </>
      )}
    </Button>
  );
}
