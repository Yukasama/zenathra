"use client";

import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { SidebarProvider } from "@/components/shared";

interface Props {
  children: React.ReactNode;
}

export default function Provider({ children }: Props) {
  return (
    <ThemeProvider enableSystem={true} attribute="class">
      <Toaster
        position="top-center"
        toastOptions={{
          className: "bg-slate-100 text dark:bg-moon-100",
        }}
      />
      <SessionProvider>
        <SidebarProvider>{children}</SidebarProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
