"use client";

import Link from "next/link";
import { Searchbar } from "@/components/ui/inputs";
import ThemeToggler from "@/components/ui/ThemeToggler";
import UserProfile from "@/components/layout/Navbar/UserProfile";
import { useSession } from "next-auth/react";
import { Menu } from "react-feather";
import { useSidebar } from "../providers/SidebarProvider";

export default function Navbar() {
  const { data: session, status } = useSession();
  const { toggleSidebar } = useSidebar();

  return (
    <div className="sticky top-0 z-20 flex w-full justify-between gap-4 p-2 px-4">
      <div className="hidden md:flex">
        <Searchbar placeholder="Search Stocks..." />
      </div>
      <button
        className="box flex p-2 md:hidden"
        onClick={() => toggleSidebar()}>
        <Menu />
      </button>

      <div className="box flex items-center justify-end gap-2 px-1 pl-3">
        {!session && status !== "loading" && (
          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/auth/signin"
              className="rounded-md bg-gray-300/50 p-1.5 px-4 font-semibold hover:bg-gray-300 dark:bg-moon-200 dark:hover:bg-moon-300">
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="rounded-md bg-blue-500 p-1.5 px-4  font-semibold text-white hover:bg-blue-600">
              Sign Up
            </Link>
          </div>
        )}
        <ThemeToggler />
        <UserProfile session={session} status={status} />
      </div>
    </div>
  );
}
