"use client";

import { Error } from "@/components/shared";

export default function ErrorSymbolPage() {
  return <Error error="Symbol Not Available" statusCode={400} />;
}
