"use client";

import { createContext, useContext, useState } from "react";

const SidebarContext = createContext({} as any);

interface Props {
  children: React.ReactNode;
}

export function SidebarProvider({ children }: Props) {
  const [open, setOpen] = useState(false);

  function toggleSidebar() {
    setOpen((prev) => (prev === open ? !open : open));
  }

  return (
    <SidebarContext.Provider value={{ open, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
