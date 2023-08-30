"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted)
    return (
      <div className="essential icon animate-pulse-right">
        <Sun className="invisible h-5" />
      </div>
    );

  return (
    <>
      {!mounted ? (
        <Button variant="outline" size="sm" className="">
          <Moon className="h-5" />
        </Button>
      ) : (
        <Button
          size="sm"
          variant="link"
          aria-label="Toggle Website Appearance"
          onClick={() =>
            theme === "light" ? setTheme("dark") : setTheme("light")
          }
          className="essential">
          {theme === "dark" ? (
            <Sun className="h-5" />
          ) : (
            <Moon className="h-5" />
          )}
        </Button>
      )}
    </>
  );
}
