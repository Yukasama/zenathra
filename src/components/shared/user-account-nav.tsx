import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/shared/user-avatar";
import { KindeUser, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/server";

interface Props {
  user: KindeUser;
  isAdmin?: boolean;
}

export function UserAccountNav({ user, isAdmin }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          user={{
            name: user.given_name || user.family_name || null,
            image: user.picture || null,
          }}
          className="h-8 w-8"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <UserAvatar
            user={{
              name: user.given_name || null,
              image: user.picture || null,
            }}
            className="h-8 w-8"
          />
          <div className="flex flex-col space-y-1 leading-none">
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
        <DropdownMenuSeparator />

        <Link href={`/u/${user.id}`}>
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </Link>

        {isAdmin && (
          <Link href="/admin/dashboard">
            <DropdownMenuItem>Stock Dashboard</DropdownMenuItem>
          </Link>
        )}

        <Link href="/u/portfolio">
          <DropdownMenuItem>My Portfolios</DropdownMenuItem>
        </Link>

        <Link href="/u/settings">
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </Link>

        <Link href="/u/settings">
          <DropdownMenuItem>Help</DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogoutLink>Log out</LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
