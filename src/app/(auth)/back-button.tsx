"use client";

import { Button } from "@nextui-org/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.back()}
      className="absolute top-5 left-5"
      aria-label="Back">
      <ArrowLeft size={18} />
      Back
    </Button>
  );
}
