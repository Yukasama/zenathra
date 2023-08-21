"use client";

import { useSidebar } from "@/components/shared/sidebar-provider";
import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export default function SidebarToggle({ children, className }: Props) {
  const { toggleSidebar } = useSidebar();

  return (
    <button className={cn(className)} onClick={() => toggleSidebar()}>
      {children}
    </button>
  );
}
