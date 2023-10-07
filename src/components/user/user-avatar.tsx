"use client";

import { AvatarProps } from "@radix-ui/react-avatar";
import { Icons } from "../shared/icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { KindeUser } from "@kinde-oss/kinde-auth-nextjs/server";

interface Props extends AvatarProps {
  user: Pick<KindeUser, "given_name" | "picture">;
}

export function UserAvatar({ user, className, ...props }: Props) {
  return (
    <Avatar className={cn(className, "border")} {...props}>
      {user.picture ? (
        <div className="essential relative aspect-square h-full w-full">
          <Image
            fill
            src={user.picture}
            sizes="100%"
            alt="profile picture"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user?.picture}</span>
          <Icons.user className="h-4 w-4" />
        </AvatarFallback>
      )}
    </Avatar>
  );
}
