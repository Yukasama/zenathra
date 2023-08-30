import Link from "next/link";
import ThemeToggle from "./theme-toggle";
import { Menu } from "lucide-react";
import { getAuthSession } from "@/lib/auth";
import Searchbar from "./searchbar";
import { UserAccountNav } from "./user-account-nav";
import SidebarToggle from "./sidebar-toggle";
import { buttonVariants } from "../ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import React from "react";
import { cn } from "@/lib/utils";
import NavbarMenu from "./navbar-menu";

export default async function Navbar() {
  const session = await getAuthSession();

  return (
    <div className="sticky top-0 z-20 flex w-full justify-between gap-4 p-2 px-4">
      <div className="hidden md:flex">
        <Searchbar />
      </div>
      <SidebarToggle className="box flex p-2 md:hidden">
        <Menu />
      </SidebarToggle>

      <NavbarMenu />

      <div className="flex px-2 gap-2 items-center">
        {!session?.user && (
          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/sign-in"
              className={buttonVariants({ variant: "subtle" })}>
              Sign In
            </Link>
          </div>
        )}
        <ThemeToggle />
        {session?.user && <UserAccountNav user={session.user} />}
      </div>
    </div>
  );
}
