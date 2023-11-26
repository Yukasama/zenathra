import { Separator } from "../ui/separator";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import dynamic from "next/dynamic";
import { SkeletonList } from "../ui/skeleton";
import { User } from "next-auth";
import LogoutLink from "./logout-link";

const UserNavLinks = dynamic(() => import("./user-nav-links"), {
  ssr: false,
  loading: () => <SkeletonList count={5} />,
});

interface Props {
  user: User;
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
            <p className="font-medium">{user.name}</p>
            <p className="w-[200px] truncate text-sm">{user.email}</p>
          </div>
        </div>

        <UserNavLinks user={user} isAdmin={isAdmin} />
        <Separator className="my-2" />
        <LogoutLink />
      </SheetContent>
    </Sheet>
  );
}
