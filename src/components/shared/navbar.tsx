import Link from "next/link";
import ThemeToggle from "./theme-toggle";
import { Menu } from "lucide-react";
import { getAuthSession } from "@/lib/auth";
import Searchbar from "./searchbar";
import { UserAccountNav } from "./user-account-nav";
import SidebarToggle from "./sidebar-toggle";
import { buttonVariants } from "../ui/button";
import NavbarMenu from "./navbar-menu";
import { cn } from "@/lib/utils";
import { db } from "@/lib/db";
import _ from "lodash";

export default async function Navbar() {
  const session = await getAuthSession();

  const [user, recentStocks] = await Promise.all([
    db.user.findFirst({
      select: { role: true },
      where: { id: session?.user?.id },
    }),
    db.userRecentStocks.findMany({
      select: {
        stock: { select: { symbol: true, image: true, companyName: true } },
      },
      where: { userId: session?.user?.id },
      take: 10,
    }),
  ]);

  const uniqueStocks = _.uniqBy(recentStocks, "stock.symbol");

  return (
    <div className="sticky top-0 z-20 flex w-full items-center justify-between gap-4 p-2 px-4">
      <div className="hidden md:flex">
        <Searchbar recentStocks={uniqueStocks} />
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
        {session?.user && (
          <UserAccountNav
            user={session.user}
            isAdmin={user?.role === "admin"}
          />
        )}
      </div>
    </div>
  );
}
