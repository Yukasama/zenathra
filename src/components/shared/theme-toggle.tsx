"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Switch } from "@nextui-org/switch";
import Skeleton from "../ui/skeleton";

export default function ThemeToggle({
  className,
}: React.HTMLAttributes<HTMLButtonElement>) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  return (
    <Skeleton isLoaded={mounted}>
      <Switch
        className={cn(className, "mt-1.5")}
        defaultSelected
        color="default"
        size="sm"
        aria-label="Toggle Website Appearance"
        onClick={() =>
          theme === "light" ? setTheme("dark") : setTheme("light")
        }
        thumbIcon={({ isSelected, className }) =>
          isSelected ? (
            <Sun className={className} />
          ) : (
            <Moon className={className} />
          )
        }
      />
    </Skeleton>
  );
}
