"use client";

import Searchbar from "./searchbar";
import { Menu } from "lucide-react";
import CompanyLogo from "../company-logo";
import { RecentStocks } from "@/types/db";
import type { KindeUser } from "@kinde-oss/kinde-auth-nextjs/server";
import { Portfolio } from "@prisma/client";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { Card } from "../ui/card";
import { UserAvatar } from "../user/user-avatar";
import PortfolioImage from "../portfolio-image";
import { useRouter } from "next/navigation";

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
      <SheetContent side="left" className="f-col gap-5">
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
        <div className="f-col justify-between h-full">
          {user &&
            portfolios?.map((portfolio) => (
              <SheetClose key={portfolio.id} asChild>
                <button
                  key={portfolio.id}
                  onClick={() => router.push(`/p/${portfolio.id}`)}>
                  <Card className="flex items-center gap-2.5 p-2 px-3 hover:bg-slate-900">
                    <PortfolioImage portfolio={portfolio} />
                    <div>
                      <p className="font-medium">{portfolio.title}</p>
                      <p className="text-sm text-slate-400">
                        {portfolio.public ? "Public" : "Private"}
                      </p>
                    </div>
                  </Card>
                </button>
              </SheetClose>
            ))}
          {user && (
            <Card>
              <div className="flex items-center p-2 px-3 gap-2.5">
                <UserAvatar user={user} />
                <div>
                  <p className="font-medium">{user.given_name}</p>
                  <p className="text-sm text-slate-400">{user.email}</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
