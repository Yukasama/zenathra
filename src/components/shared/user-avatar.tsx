"use client";

import { AvatarProps } from "@radix-ui/react-avatar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { User } from "next-auth";

interface Props extends AvatarProps {
  user: Pick<User, "name" | "image"> | undefined;
  fallbackFontSize?: number;
}

export function UserAvatar({
  user,
  fallbackFontSize = 16,
  className,
  ...props
}: Props) {
  return (
    <Avatar className={cn(className, "border")} {...props}>
      {user?.image ? (
        <div className="relative aspect-square h-full w-full">
          <Image
            fill
            src={user.image}
            sizes="100%"
            alt="profile picture"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <AvatarFallback>
          <div className="h-full w-full f-box bg-primary">
            <p
              className="font-medium text-white"
              style={{ fontSize: fallbackFontSize }}>
              {user?.name?.[0].toUpperCase()}
            </p>
          </div>
        </AvatarFallback>
      )}
    </Avatar>
  );
}
