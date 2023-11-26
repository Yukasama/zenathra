"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Skeleton from "../ui/skeleton";
import { Button } from "@nextui-org/button";

export default function ThemeToggle({
  className,
}: React.HTMLAttributes<HTMLButtonElement>) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  return (
    <Skeleton isLoaded={mounted}>
      <Button
        className={cn(className)}
        size="sm"
        variant="flat"
        isIconOnly
        aria-label="Toggle Website Appearance"
        onClick={() =>
          theme === "light" ? setTheme("dark") : setTheme("light")
        }>
        {theme === "light" ? <Sun size={18} /> : <Moon size={18} />}
      </Button>
    </Skeleton>
  );
}
