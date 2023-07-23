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

  if (!mounted) {
    return (
      <div className="theme-toggle h-10 w-10 rounded-md bg-gray-200 p-[8px] dark:bg-moon-100/70"></div>
    );
  }

  return (
    <button
      aria-label="Toggle Website Appearance"
      onClick={() => (theme === "light" ? setTheme("dark") : setTheme("light"))}
      className="theme-toggle icon">
      {theme === "dark" ? (
        <Sun className="theme-toggle text h-5" />
      ) : (
        <Moon className="theme-toggle text h-5" />
      )}
    </button>
  );
}
