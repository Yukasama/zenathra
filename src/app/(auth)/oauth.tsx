"use client";

import { signIn } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import { capitalize, cn } from "@/lib/utils";
import { Button } from "@nextui-org/react";
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
      aria-label={`Sign in with ${capitalize(provider)}`}
      className={cn("bg-item hover:bg-item-hover border gap-3", className)}
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
