import Link from "next/link";
import ThemeToggle from "./theme-toggle";
import { Menu } from "lucide-react";
import Searchbar from "./searchbar";
import { UserAccountNav } from "./user-account-nav";
import SidebarToggle from "./sidebar-toggle";
import { buttonVariants } from "../ui/button";
import NavbarMenu from "./navbar-menu";
import { cn } from "@/lib/utils";
import { db } from "@/db";
import _ from "lodash";
import CompanyLogo from "./company-logo";
import {
  LoginLink,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";

export default async function Navbar() {
  const { getUser, getPermission } = getKindeServerSession();
  const user = getUser();

  const recentStocks = await db.userRecentStocks.findMany({
    select: {
      stock: {
        select: {
          symbol: true,
          image: true,
          companyName: true,
        },
      },
    },
    where: { userId: user?.id ?? undefined },
    take: 10,
  });

  const uniqueStocks = _.uniqBy(recentStocks, "stock.symbol");

  return (
    <div className="sticky top-0 z-20 flex w-full items-center justify-between gap-4 p-2 px-4">
      <div className="hidden md:flex items-center gap-3">
        <Link href="/">
          <CompanyLogo px={30} />
        </Link>
        <Searchbar recentStocks={uniqueStocks} />
      </div>
      <SidebarToggle className="md:hidden">
        <Menu className="h-5" />
      </SidebarToggle>

      <NavbarMenu user={user} />

      <div className="flex items-center gap-3">
        {!user && (
          <LoginLink
            className={cn(
              buttonVariants({ variant: "subtle" }),
              "hidden lg:flex"
            )}>
            Sign In
          </LoginLink>
        )}
        <ThemeToggle />
        {user && (
          <UserAccountNav
            user={user}
            isAdmin={getPermission("upload:stocks").isGranted}
          />
        )}
      </div>
    </div>
  );
}
