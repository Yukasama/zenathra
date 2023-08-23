import Link from "next/link";
import { Searchbar, UserProfile, SidebarToggle } from "@/components/shared";
import { ThemeToggle } from "@/components/ui";
import { Menu } from "lucide-react";
import { getAuthSession } from "@/lib/auth";

export default async function Navbar() {
  const session = await getAuthSession();

  return (
    <div className="sticky top-0 z-20 flex w-full justify-between gap-4 p-2 px-4">
      <div className="hidden md:flex">
        <Searchbar placeholder="Search Stocks..." />
      </div>
      <SidebarToggle className="box flex p-2 md:hidden">
        <Menu />
      </SidebarToggle>

      <div className="box flex items-center justify-end gap-2 px-3">
        {!session?.user && (
          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/auth/sign-in"
              className="rounded-md bg-slate-300/50 p-1.5 px-4 font-semibold hover:bg-slate-300 dark:bg-moon-200 dark:hover:bg-moon-300">
              Sign In
            </Link>
            <Link
              href="/auth/sign-up"
              className="rounded-md bg-blue-500 p-1.5 px-4 font-semibold text-white hover:bg-blue-600">
              Sign Up
            </Link>
          </div>
        )}
        <ThemeToggle />
        <UserProfile session={session} />
      </div>
    </div>
  );
}
