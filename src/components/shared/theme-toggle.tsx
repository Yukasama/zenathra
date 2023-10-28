"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export default function ThemeToggle({
  className,
}: React.HTMLAttributes<HTMLButtonElement>) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  return (
    <div className={cn(className, "border rounded-md")}>
      {!mounted ? (
        <Button variant="link" size="sm" className="animate-pulse-right">
          <Moon className="h-[18px] invisible" />
        </Button>
      ) : (
        <Button
          size="sm"
          variant="link"
          aria-label="Toggle Website Appearance"
          onClick={() =>
            theme === "light" ? setTheme("dark") : setTheme("light")
          }>
          {theme === "light" ? (
            <Moon className="h-[18px] text-zinc-600 dark:text-zinc-300" />
          ) : (
            <Sun className="h-[18px] text-zinc-600 dark:text-zinc-300" />
          )}
        </Button>
      )}
    </div>
  );
}
