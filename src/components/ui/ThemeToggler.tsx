"use client";

import { Sun, Moon } from "react-feather";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggler() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted)
    return (
      <div className="essential icon animate-pulse-right">
        <Sun className="essential text invisible h-5" />
      </div>
    );

  return (
    <button
      aria-label="Toggle Website Appearance"
      onClick={() => (theme === "light" ? setTheme("dark") : setTheme("light"))}
      className="essential icon">
      {theme === "dark" ? (
        <Sun className="essential text h-5" />
      ) : (
        <Moon className="essential text h-5" />
      )}
    </button>
  );
}
