import Link from "next/link";
import ThemeToggle from "./theme-toggle";
import { Menu } from "lucide-react";
import { getAuthSession } from "@/lib/auth";
import Searchbar from "./searchbar";
import { UserAccountNav } from "./user-account-nav";
import SidebarToggle from "./sidebar-toggle";
import { buttonVariants } from "../ui/button";
import React from "react";
import NavbarMenu from "./navbar-menu";
import { cn } from "@/lib/utils";

export default async function Navbar() {
  const session = await getAuthSession();

  return (
    <div className="sticky top-0 z-20 flex w-full items-center justify-between gap-4 p-2 px-4">
      <div className="hidden md:flex">
        <Searchbar />
      </div>
      <SidebarToggle className="md:hidden">
        <Menu className="h-5" />
      </SidebarToggle>

      <NavbarMenu />

      <div className="flex items-center gap-3">
        {!session?.user && (
          <Link
            href="/sign-in"
            className={cn(
              buttonVariants({ variant: "subtle" }),
              "hidden lg:flex"
            )}>
            Sign In
          </Link>
        )}
        <ThemeToggle />
        {session?.user && <UserAccountNav user={session.user} />}
      </div>
    </div>
  );
}
