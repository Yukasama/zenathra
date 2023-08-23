"use client";

import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "@/components/shared";
import { Toaster } from "../ui/toaster";

interface Props {
  children: React.ReactNode;
}

export default function Provider({ children }: Props) {
  return (
    <ThemeProvider enableSystem={true} attribute="class ">
      <Toaster />
      <SidebarProvider>{children}</SidebarProvider>
    </ThemeProvider>
  );
}
