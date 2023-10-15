"use client";

import Searchbar from "./searchbar";
import {
  CandlestickChart,
  FilePlus2,
  Menu,
  SlidersHorizontal,
  User,
} from "lucide-react";
import CompanyLogo from "../company-logo";
import { RecentStocks } from "@/types/db";
import type { KindeUser } from "@kinde-oss/kinde-auth-nextjs/server";
import { Portfolio } from "@prisma/client";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { Card } from "../ui/card";
import { UserAvatar } from "../user/user-avatar";
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

interface Props {
  user: KindeUser | null;
  portfolios: Pick<Portfolio, "id" | "title" | "color" | "public">[] | null;
  recentStocks: RecentStocks | null;
}

export default function Sidebar({ user, portfolios, recentStocks }: Props) {
  const router = useRouter();

  return (
    <Sheet>
      <SheetTrigger>
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
      </SheetTrigger>
      <SheetContent side="left" className="f-col gap-4 rounded-r-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CompanyLogo px={35} />
            <p className="text-lg">Elysium</p>
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
                <Card className="hover:bg-slate-900 h-32 cursor-pointer">
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
                  <Card className="hover:bg-slate-900 h-32 cursor-pointer">
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
                <Card className="hover:bg-slate-900 h-32 cursor-pointer">
                  <SheetClose asChild>
                    <Link
                      href={user ? "/settings/profile" : "/api/auth/login"}
                      className="f-col items-center justify-center gap-1 h-full w-full font-medium">
                      <User className="h-7 w-7" />
                      {user ? "Edit Profile" : "Create Account"}
                    </Link>
                  </SheetClose>
                </Card>
                <Card className="hover:bg-slate-900 h-32 cursor-pointer">
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
                    className="hover:bg-slate-900 h-32 cursor-pointer">
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
                <Link href="/dashboard" className="w-full py-4 text-start">
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
        <div className="f-col justify-between h-full">
          {user &&
            portfolios?.map((portfolio) => (
              <SheetClose key={portfolio.id} asChild>
                <button
                  key={portfolio.id}
                  onClick={() => router.push(`/p/${portfolio.id}`)}>
                  <Card className="flex items-center gap-2.5 p-2 px-3 hover:bg-slate-100 dark:hover:bg-slate-900">
                    <PortfolioImage portfolio={portfolio} />
                    <div>
                      <p className="font-medium">{portfolio.title}</p>
                      <p className="text-sm text-start text-slate-400">
                        {portfolio.public ? "Public" : "Private"}
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
                <p className="font-medium">{user.given_name}</p>
                <p className="text-sm text-slate-400">{user.email}</p>
              </div>
            </Card>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
