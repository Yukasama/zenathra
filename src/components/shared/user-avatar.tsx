"use client";

import { User } from "@prisma/client";
import { AvatarProps } from "@radix-ui/react-avatar";

import { Icons } from "../icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "image" | "name">;
}

export function UserAvatar({ user, className, ...props }: UserAvatarProps) {
  return (
    <Avatar className={cn(className)} {...props}>
      {user.image ? (
        <div className="essential relative aspect-square h-full w-full">
          <Image
            fill
            src={user.image}
            alt="profile picture"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user?.name}</span>
          <Icons.user className="h-4 w-4" />
        </AvatarFallback>
      )}
    </Avatar>
  );
}
