"use client";

import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "@/components/shared";
import { Toaster } from "../ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { trpc } from "@/app/_trpc/client";

interface Props {
  children: React.ReactNode;
}

export default function Provider({ children }: Props) {
  const [queryClient] = useState(() => new QueryClient({}));
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:3000/api/trpc",
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider enableSystem={true} attribute="class">
          <Toaster />
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
