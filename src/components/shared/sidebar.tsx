"use client";

import Searchbar from "./searchbar";
import {
  CandlestickChart,
  FilePlus2,
  Menu,
  SlidersHorizontal,
  User as UserIcon,
} from "lucide-react";
import CompanyLogo from "./company-logo";
import { RecentStocks } from "@/types/db";
import { Portfolio } from "@prisma/client";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import { Card } from "../ui/card";
import { UserAvatar } from "./user-avatar";
import PortfolioImage from "../portfolio/portfolio-image";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import Link from "next/link";
import { navLinks } from "@/config/site";
import { SITE } from "@/config/site";
import { User } from "next-auth";
import { buttonVariants } from "../ui/button";

interface Props {
  user: User | undefined;
  portfolios:
    | Pick<Portfolio, "id" | "title" | "color" | "isPublic">[]
    | undefined;
  recentStocks: RecentStocks | null;
}

export default function Sidebar({ user, portfolios, recentStocks }: Props) {
  const router = useRouter();

  return (
    <Sheet>
      <SheetTrigger>
        <div className={buttonVariants({ variant: "subtle", size: "xs" })}>
          <Menu className="h-5" />
        </div>
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
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="getting-started">
            <AccordionTrigger>Getting started</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-3">
                <Card className="hover:bg-zinc-100 dark:hover:bg-zinc-900 h-32 cursor-pointer">
                  <SheetClose asChild>
                    <Link
                      href="/screener"
                      className="f-col items-center justify-center gap-1 h-full w-full font-medium">
                      <SlidersHorizontal className="h-7 w-7" />
                      Stock Screener
                    </Link>
                  </SheetClose>
                </Card>
                {user && (
                  <Card className="hover:bg-zinc-100 dark:hover:bg-zinc-900 h-32 cursor-pointer">
                    <SheetClose asChild>
                      <Link
                        href="/portfolio"
                        className="f-col items-center justify-center gap-1 h-full w-full font-medium">
                        <FilePlus2 className="h-7 w-7" />
                        Create Portfolio
                      </Link>
                    </SheetClose>
                  </Card>
                )}
                <Card className="hover:bg-zinc-100 dark:hover:bg-zinc-900 h-32 cursor-pointer">
                  <SheetClose asChild>
                    <Link
                      href={user ? "/settings/profile" : "/api/auth/login"}
                      className="f-col items-center justify-center gap-1 h-full w-full font-medium">
                      <UserIcon className="h-7 w-7" />
                      {user ? "Edit Profile" : "Create Account"}
                    </Link>
                  </SheetClose>
                </Card>
                <Card className="hover:bg-zinc-100 dark:hover:bg-zinc-900 h-32 cursor-pointer">
                  <SheetClose asChild>
                    <Link
                      href="/stocks"
                      className="f-col items-center justify-center gap-1 h-full w-full font-medium">
                      <CandlestickChart className="h-7 w-7" />
                      Explore stocks
                    </Link>
                  </SheetClose>
                </Card>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="highlights">
            <AccordionTrigger>Highlights</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-3">
                {navLinks.map((link) => (
                  <Card
                    key={link.title}
                    className="hover:bg-zinc-100 dark:hover:bg-zinc-900 h-32 cursor-pointer">
                    <SheetClose asChild>
                      <Link
                        href={link.href}
                        className="f-col items-center justify-center gap-1 h-full w-full font-medium">
                        <link.icon className="h-7 w-7" />
                        {link.title}
                      </Link>
                    </SheetClose>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="dashboard">
            <AccordionTrigger asLink>
              <SheetClose asChild>
                <Link href="/" className="w-full py-4 text-start">
                  Dashboard
                </Link>
              </SheetClose>
            </AccordionTrigger>
          </AccordionItem>
          <AccordionItem value="pricing">
            <AccordionTrigger asLink>
              <SheetClose asChild>
                <Link href="/pricing" className="w-full py-4 text-start">
                  Pricing
                </Link>
              </SheetClose>
            </AccordionTrigger>
          </AccordionItem>
        </Accordion>
        <div className="f-col gap-3">
          {user &&
            portfolios?.map((portfolio) => (
              <SheetClose key={portfolio.id} asChild>
                <button
                  key={portfolio.id}
                  onClick={() => router.push(`/p/${portfolio.id}`)}>
                  <Card className="flex items-center gap-2.5 p-2 px-3 hover:bg-zinc-100 dark:hover:bg-zinc-900">
                    <PortfolioImage portfolio={portfolio} />
                    <div>
                      <p className="font-medium">{portfolio.title}</p>
                      <p className="text-sm text-start text-zinc-400">
                        {portfolio.isPublic ? "Public" : "Private"}
                      </p>
                    </div>
                  </Card>
                </button>
              </SheetClose>
            ))}
          {user && (
            <Card className="flex items-center p-2 px-3 gap-2.5">
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
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
