"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Icons } from "./shared/icons";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  provider: "google" | "facebook" | "github";
}

export default function OAuth({ provider, className, ...props }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = async () => {
    setIsLoading(true);

    try {
      await signIn(provider);
    } catch (error) {
      toast({
        title: "Error",
        description: `There was an error logging in with ${
          provider[0].toUpperCase() + provider.slice(1)
        }`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex justify-center", className)} {...props}>
      <Button
        isLoading={isLoading}
        className="w-full border"
        onClick={onSubmit}>
        {!isLoading && <Icons.google className="h-4 w-4 mr-2" />}
        {provider[0].toUpperCase() + provider.slice(1)}
      </Button>
    </div>
  );
}
