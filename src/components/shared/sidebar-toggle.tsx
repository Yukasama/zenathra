"use client";

import { useSidebar } from "@/components/shared/sidebar-provider";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export default function SidebarToggle({ children, className }: Props) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      size="sm"
      variant="subtle"
      className={cn(className)}
      onClick={() => toggleSidebar()}>
      {children}
    </Button>
  );
}
