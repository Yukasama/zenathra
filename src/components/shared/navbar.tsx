import Link from "next/link";
import ThemeToggle from "./theme-toggle";
import Searchbar from "./searchbar";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { db } from "@/db";
import _ from "lodash";
import CompanyLogo from "../company-logo";
import {
  LoginLink,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";
import dynamic from "next/dynamic";
import { UserAccountNav } from "./user-account-nav";
import { Menu } from "lucide-react";
import NavbarMenu from "./navbar-menu";

const Sidebar = dynamic(() => import("./sidebar"), {
  ssr: false,
  loading: () => (
    <div
      className={cn(
        buttonVariants({
          size: "xs",
          variant: "link",
        }),
        "border"
      )}>
      <Menu className="h-5" />
    </div>
  ),
});

export default async function Navbar() {
  const { getUser, getPermission } = getKindeServerSession();
  const user = getUser();

  const [portfolios, recentStocks] = await Promise.all([
    db.portfolio.findMany({
      select: {
        id: true,
        title: true,
        color: true,
        public: true,
      },
      where: { creatorId: user?.id ?? undefined },
      orderBy: { title: "asc" },
    }),
    db.userRecentStocks.findMany({
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
    }),
  ]);

  const uniqueStocks = _.uniqBy(recentStocks, "stock.symbol");

  return (
    <div className="sticky top-0 h-16 z-20 flex w-full items-center justify-between gap-4 p-2 px-4 border-b bg-card/50">
      <div className="flex items-center gap-5">
        <Sidebar
          user={user}
          portfolios={portfolios}
          recentStocks={uniqueStocks}
        />
        <Link href="/">
          <CompanyLogo px={30} priority />
        </Link>
        <div className="md:flex hidden">
          <Searchbar recentStocks={uniqueStocks} />
        </div>
      </div>

      <NavbarMenu user={user} />

      <div className="flex items-center gap-3">
        <div className="md:hidden flex">
          <Searchbar recentStocks={uniqueStocks} />
        </div>
        <ThemeToggle />
        {user && (
          <UserAccountNav
            user={user}
            isAdmin={getPermission("(upload:stocks)").isGranted}
          />
        )}
        {!user && (
          <LoginLink className={buttonVariants({ variant: "subtle" })}>
            Sign In
          </LoginLink>
        )}
      </div>
    </div>
  );
}
