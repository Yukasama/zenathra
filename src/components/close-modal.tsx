"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CloseModal() {
  const router = useRouter();

  return (
    <Button
      variant="link"
      size="xs"
      onClick={() => router.back()}
      aria-label="close-modal">
      <X className="w-4 h-4" />
    </Button>
  );
}
