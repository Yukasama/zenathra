"use client";

import { useSidebar } from "@/components/shared/sidebar-provider";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export default function SidebarToggle({
  children,
  className,
  ...props
}: Props) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      size="xs"
      variant="subtle"
      className={cn(className)}
      onClick={() => toggleSidebar()}
      {...props}>
      {children}
    </Button>
  );
}
