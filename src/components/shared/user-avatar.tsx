"use client";

import { AvatarProps } from "@radix-ui/react-avatar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { KindeUser } from "@kinde-oss/kinde-auth-nextjs/server";

interface Props extends AvatarProps {
  user: Pick<KindeUser, "given_name" | "picture"> | null | undefined;
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
      {user?.picture ? (
        <div className="relative aspect-square h-full w-full">
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
          <div className="h-full w-full f-box bg-primary">
            <p
              className="font-medium text-white"
              style={{ fontSize: fallbackFontSize }}>
              {user?.given_name?.[0].toUpperCase() ?? "N/A"}
            </p>
          </div>
        </AvatarFallback>
      )}
    </Avatar>
  );
}
