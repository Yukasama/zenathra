import { Separator } from "../ui/separator";
import { UserAvatar } from "@/components/shared/user-avatar";
import {
  type KindeUser,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { LogOut } from "lucide-react";
import dynamic from "next/dynamic";
import Skeleton from "../ui/skeleton";

const UserNavLinks = dynamic(() => import("./user-nav-links"), {
  ssr: false,
  loading: () => (
    <>
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-9 w-full" />
      ))}
    </>
  ),
});

interface Props {
  user: KindeUser;
  isAdmin?: boolean;
}

export function UserAccountNav({ user, isAdmin }: Props) {
  return (
    <Sheet>
      <SheetTrigger>
        <UserAvatar user={user} className="h-8 w-8" />
      </SheetTrigger>
      <SheetContent className="rounded-l-xl">
        <div className="flex items-center gap-2 p-2 mb-1">
          <UserAvatar user={user} className="h-9 w-9" />
          <div className="f-col">
            {user.given_name && (
              <p className="font-medium">{user.given_name}</p>
            )}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>

        <UserNavLinks user={user} isAdmin={isAdmin} />

        <Separator className="my-2" />

        <LogoutLink className="flex items-center h-9 p-1 rounded-md px-4 hover:bg-zinc-100 dark:hover:bg-zinc-900">
          <LogOut className="w-5 h-5 mr-2 text-zinc-400" />
          <h2 className="text-[15px]">Sign Out</h2>
        </LogoutLink>
      </SheetContent>
    </Sheet>
  );
}
