"use client";

import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "./sidebar-provider";
import TrpcProvider from "@/lib/trpc/Provider";

interface Props {
  children: React.ReactNode;
}

export default function Provider({ children }: Props) {
  return (
    <TrpcProvider>
      <ThemeProvider attribute="class">
        <SidebarProvider>{children}</SidebarProvider>
      </ThemeProvider>
    </TrpcProvider>
  );
}
