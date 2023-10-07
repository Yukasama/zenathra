import Searchbar from "./searchbar";
import { Menu } from "lucide-react";
import CompanyLogo from "../company-logo";
import { RecentStocks } from "@/types/db";
import type { KindeUser } from "@kinde-oss/kinde-auth-nextjs/server";
import { Portfolio } from "@prisma/client";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { Card } from "../ui/card";
import { UserAvatar } from "../user/user-avatar";

interface Props {
  user: KindeUser | null;
  portfolios: Pick<Portfolio, "id" | "title" | "color" | "public">[] | null;
  recentStocks: RecentStocks | null;
}

export default function SidebarPortable({
  user,
  portfolios,
  recentStocks,
}: Props) {
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
        <Searchbar recentStocks={recentStocks} className="w-full" />
        <div className="f-col justify-between h-full">
          {user &&
            portfolios?.map((portfolio) => (
              <Link key={portfolio.id} href={`/p/${portfolio.id}`}>
                <Card className="flex items-center gap-2.5 p-2 px-3 hover:bg-slate-900">
                  <div
                    className="rounded-full border h-10 w-10 f-box hover:bg-slate-100 dark:hover:bg-slate-900"
                    style={{ backgroundColor: portfolio.color || "#000" }}>
                    <p className="font-medium text-lg">
                      {portfolio.title[0].toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">{portfolio.title}</p>
                    <p className="text-sm text-slate-400">
                      {portfolio.public ? "Public" : "Private"}
                    </p>
                  </div>
                </Card>
              </Link>
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
