import Link from "next/link";
import ThemeToggle from "./theme-toggle";
import Searchbar from "./searchbar";
import { db } from "@/db";
import CompanyLogo from "./company-logo";
import dynamic from "next/dynamic";
import { UserAccountNav } from "./user-account-nav";
import { Menu } from "lucide-react";
import NavbarMenu from "./navbar-menu";
import { Button, buttonVariants } from "../ui/button";
import { getUser } from "@/lib/auth";

const Sidebar = dynamic(() => import("./sidebar"), {
  ssr: false,
  loading: () => (
    <div className={buttonVariants({ variant: "subtle", size: "xs" })}>
      <Menu className="h-5" />
    </div>
  ),
});

export default async function Navbar() {
  const user = await getUser();
  const dbUser = await db.user.findFirst({
    select: {
      role: true,
      portfolios: {
        select: {
          id: true,
          title: true,
          color: true,
          public: true,
        },
        orderBy: { title: "asc" },
      },
      recentStocks: {
        select: {
          stock: {
            select: {
              symbol: true,
              image: true,
              companyName: true,
            },
          },
        },
        distinct: "stockId",
        take: 5,
      },
    },
    where: { id: user?.id },
  });

  const isAdmin = dbUser?.role === "admin";

  return (
    <div className="sticky top-0 h-16 z-20 flex w-full items-center justify-between gap-4 p-2 px-6 border-b bg-card/50">
      <div className="flex items-center gap-5 flex-1">
        <Sidebar
          user={user}
          portfolios={dbUser?.portfolios}
          recentStocks={dbUser?.recentStocks}
        />
        <Link href="/">
          <CompanyLogo px={30} priority />
        </Link>
        <div className="md:flex hidden">
          <Searchbar recentStocks={dbUser?.recentStocks} />
        </div>
      </div>

      <NavbarMenu user={user} />

      <div className="flex items-center gap-3 flex-1 justify-end">
        <div className="md:hidden flex">
          <Searchbar recentStocks={dbUser?.recentStocks} />
        </div>
        <ThemeToggle />
        {user && <UserAccountNav user={user} isAdmin={isAdmin} />}
        {!user && (
          <Link href="/sign-in">
            <Button className="whitespace-nowrap bg-primary text-white">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
