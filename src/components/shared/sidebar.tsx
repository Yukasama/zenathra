"use client";

import Searchbar from "./searchbar";
import {
  CandlestickChart,
  DollarSign,
  FilePlus2,
  LayoutDashboard,
  Menu,
  SlidersHorizontal,
  User as UserIcon,
} from "lucide-react";
import CompanyLogo from "./company-logo";
import { Portfolio, Stock } from "@prisma/client";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import { Card } from "../ui/card";
import { UserAvatar } from "./user-avatar";
import PortfolioImage from "../portfolio/portfolio-image";
import { Accordion, AccordionItem, Button } from "@nextui-org/react";
import Link from "next/link";
import { navLinks } from "@/config/site";
import { SITE } from "@/config/site";
import { User } from "next-auth";

interface Props {
  user: User | undefined;
  portfolios:
    | Pick<Portfolio, "id" | "title" | "color" | "isPublic">[]
    | undefined;
  recentStocks: Pick<Stock, "symbol" | "companyName" | "image">[] | undefined;
}

export default function Sidebar({ user, portfolios, recentStocks }: Props) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button isIconOnly variant="flat" size="sm" aria-label="Open sidebar">
          <Menu size={18} />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="f-col gap-4 rounded-r-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CompanyLogo px={35} />
            <p className="text-lg">{SITE.name}</p>
          </div>
        </div>

        <Searchbar
          recentStocks={recentStocks}
          responsive={false}
          className="w-full"
        />

        <div className="f-col justify-between h-full">
          <Accordion defaultExpandedKeys={["portfolios"]}>
            <AccordionItem
              key="getting-started"
              aria-label="Getting started"
              title="Getting started">
              <div className="grid grid-cols-2 gap-3">
                <Card className="hover:bg-zinc-100 dark:hover:bg-zinc-900 h-32 cursor-pointer">
                  <SheetClose asChild>
                    <Link
                      href="/screener"
                      className="f-col items-center justify-center gap-1 h-full w-full font-medium">
                      <SlidersHorizontal size={28} />
                      <p className="text-sm sm:text-base">Stock Screener</p>
                    </Link>
                  </SheetClose>
                </Card>
                {user && (
                  <Card className="hover:bg-zinc-100 dark:hover:bg-zinc-900 h-32 cursor-pointer">
                    <SheetClose asChild>
                      <Link
                        href="/portfolio"
                        className="f-col items-center justify-center gap-1 h-full w-full font-medium">
                        <FilePlus2 size={28} />
                        <p className="text-sm sm:text-base">Create Portfolio</p>
                      </Link>
                    </SheetClose>
                  </Card>
                )}
                <Card className="hover:bg-zinc-100 dark:hover:bg-zinc-900 h-32 cursor-pointer">
                  <SheetClose asChild>
                    <Link
                      href={user ? "/settings/profile" : "/sign-in"}
                      className="f-col items-center justify-center gap-1 h-full w-full font-medium">
                      <UserIcon size={28} />
                      <p className="text-sm sm:text-base">
                        {user ? "Edit Profile" : "Create Account"}
                      </p>
                    </Link>
                  </SheetClose>
                </Card>
                <Card className="hover:bg-zinc-100 dark:hover:bg-zinc-900 h-32 cursor-pointer">
                  <SheetClose asChild>
                    <Link
                      href="/stocks"
                      className="f-col items-center justify-center gap-1 h-full w-full font-medium">
                      <CandlestickChart size={28} />
                      <p className="text-sm sm:text-base">Explore Stocks</p>
                    </Link>
                  </SheetClose>
                </Card>
              </div>
            </AccordionItem>

            <AccordionItem
              key="highlights"
              aria-label="Highlights"
              title="Highlights">
              <div className="grid grid-cols-2 gap-3">
                {navLinks.map((link) => (
                  <Card
                    key={link.title}
                    className="hover:bg-zinc-100 dark:hover:bg-zinc-900 h-32 cursor-pointer">
                    <SheetClose asChild>
                      <Link
                        href={link.href}
                        className="f-col items-center justify-center gap-1 h-full w-full font-medium">
                        <link.icon size={28} />
                        <p className="text-sm sm:text-base">{link.title}</p>
                      </Link>
                    </SheetClose>
                  </Card>
                ))}
              </div>
            </AccordionItem>

            <AccordionItem
              key="information"
              aria-label="Information"
              title="Information">
              <div className="grid grid-cols-2 gap-3">
                <Card className="hover:bg-zinc-100 dark:hover:bg-zinc-900 h-32 cursor-pointer">
                  <SheetClose asChild>
                    <Link
                      href="/"
                      className="f-col items-center justify-center gap-1 h-full w-full font-medium">
                      <LayoutDashboard size={28} />
                      <p className="text-sm sm:text-base">Dashboard</p>
                    </Link>
                  </SheetClose>
                </Card>
                <Card className="hover:bg-zinc-100 dark:hover:bg-zinc-900 h-32 cursor-pointer">
                  <SheetClose asChild>
                    <Link
                      href="/pricing"
                      className="f-col items-center justify-center gap-1 h-full w-full font-medium">
                      <DollarSign size={28} />
                      <p className="text-sm sm:text-base">Pricing</p>
                    </Link>
                  </SheetClose>
                </Card>
              </div>
            </AccordionItem>

            <AccordionItem
              key="portfolios"
              aria-label="Portfolios"
              title="Portfolios">
              {user ? (
                <div className="max-h-72 scroll-auto f-col gap-2">
                  {portfolios?.map((portfolio) => (
                    <SheetClose key={portfolio.id} asChild>
                      <Link
                        key={portfolio.id}
                        className="w-full"
                        href={`/p/${portfolio.id}`}>
                        <Card className="flex items-center gap-2.5 p-2 px-3 hover:bg-zinc-100 dark:hover:bg-zinc-900">
                          <PortfolioImage portfolio={portfolio} />
                          <div>
                            <p className="font-medium">{portfolio.title}</p>
                            <p className="text-sm text-start text-zinc-400">
                              {portfolio.isPublic ? "Public" : "Private"}
                            </p>
                          </div>
                        </Card>
                      </Link>
                    </SheetClose>
                  ))}
                </div>
              ) : (
                <SheetClose asChild>
                  <Link
                    href="/sign-in"
                    className="text-zinc-500 hover:underline text-center">
                    Sign in to view portfolios
                  </Link>
                </SheetClose>
              )}
            </AccordionItem>
          </Accordion>

          {user && (
            <Link href="/settings">
              <Card className="flex items-center p-2 px-3 gap-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-900">
                <UserAvatar user={user} />
                <div>
                  <p className="font-medium truncate max-w-[200px]">
                    {user.name}
                  </p>
                  <p className="text-sm text-zinc-400 truncate max-w-[200px]">
                    {user.email}
                  </p>
                </div>
              </Card>
            </Link>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
