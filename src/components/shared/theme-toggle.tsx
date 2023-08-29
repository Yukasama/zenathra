"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

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
    <button
      aria-label="Toggle Website Appearance"
      onClick={() => (theme === "light" ? setTheme("dark") : setTheme("light"))}
      className="essential icon">
      {theme === "dark" ? <Sun className="h-5" /> : <Moon className="h-5" />}
    </button>
  );
}
