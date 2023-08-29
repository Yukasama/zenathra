"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

export function CloseModal() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      className="h-6 w-6 p-0 rounded-md"
      onClick={() => router.back()}
      aria-label="close-modal">
      <X className="w-4 h-4" />
    </Button>
  );
}
