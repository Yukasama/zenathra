import Link from "next/link";
import ThemeToggle from "./theme-toggle";
import Searchbar from "./searchbar";
import { buttonVariants } from "../ui/button";
import { db } from "@/db";
import _ from "lodash";
import CompanyLogo from "./company-logo";
import dynamic from "next/dynamic";
import { UserAccountNav } from "./user-account-nav";
import { Menu } from "lucide-react";
import NavbarMenu from "./navbar-menu";
import { Button } from "@nextui-org/button";
import { getUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

const Sidebar = dynamic(() => import("./sidebar"), {
  ssr: false,
  loading: () => (
    <Button
      isIconOnly
      variant="bordered"
      startContent={<Menu className="h-5" />}
    />
  ),
});

export default async function Navbar() {
  const user = await getUser();

  const [dbUser, portfolios, recentStocks] = await Promise.all([
    db.user.findFirst({
      select: { role: true },
      where: { id: user?.id },
    }),
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
    <div className="sticky top-0 h-16 z-20 flex w-full items-center justify-between gap-4 p-2 px-6 border-b bg-card/50">
      <div className="flex items-center gap-5 flex-1">
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

      <div className="flex items-center gap-3 flex-1 justify-end">
        <div className="md:hidden flex">
          <Searchbar recentStocks={uniqueStocks} />
        </div>
        <ThemeToggle />
        {user && (
          <UserAccountNav user={user} isAdmin={dbUser?.role === "admin"} />
        )}
        {!user && (
          <Link
            href="/sign-in"
            className={cn(
              buttonVariants({ variant: "subtle" }),
              "whitespace-nowrap"
            )}>
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}
