"use client";

import Link from "next/link";
import { User } from "next-auth";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/shared/user-avatar";

interface UserAccountNavProps {
  user: User;
  isAdmin?: boolean;
}

export function UserAccountNav({ user, isAdmin }: UserAccountNavProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          user={{ name: user.name || null, image: user.image || null }}
          className="h-8 w-8"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
        <UserAvatar
          user={{ name: user.name || null, image: user.image || null }}
          className="h-8 w-8"
        />
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
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
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(event) => {
            event.preventDefault();
            signOut({
              callbackUrl: `${window.location.origin}/sign-in`,
            });
          }}>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
